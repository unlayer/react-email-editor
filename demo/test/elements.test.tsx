import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmailEditorProps } from 'react-email-editor';
import ElementsExample from '../src/elements';
import { createWelcomeDesign } from '../src/elements/welcome';
import { STORAGE_KEY, type Editor } from '../src/elements/storage';

const harness = vi.hoisted(() => ({
  props: null as EmailEditorProps | null,
  listeners: {} as Record<string, () => void>,
  loadDesign: vi.fn(),
  exportHtml: vi.fn(),
}));

// UI/persistence tests use the real Elements renderer and a controlled hosted-editor boundary.
vi.mock('react-email-editor', async () => {
  const React = await import('react');
  return {
    default: React.forwardRef((props: EmailEditorProps, ref) => {
      harness.props = props;
      React.useImperativeHandle(ref, () => ({ editor: harness }));
      return <div>Hosted editor</div>;
    }),
  };
});

function mount() {
  return render(
    <MemoryRouter>
      <ElementsExample />
    </MemoryRouter>
  );
}

function signalReady() {
  act(() => {
    harness.props?.onReady?.({
      ...harness,
      addEventListener: (name: string, callback: () => void) => {
        harness.listeners[name] = callback;
      },
    } as unknown as Parameters<NonNullable<EmailEditorProps['onReady']>>[0]);
  });
}

beforeEach(() => {
  window.localStorage.clear();
  harness.listeners = {};
  harness.loadDesign.mockReset();
  harness.exportHtml.mockReset();
  harness.exportHtml.mockImplementation((callback) =>
    callback({
      design: createWelcomeDesign(),
      html: '<html><body>Welcome to Acme</body></html>',
    })
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Elements integration', () => {
  it('generates a complete design and gates export on the design-loaded event', () => {
    mount();
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and export',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    expect(harness.loadDesign).not.toHaveBeenCalled();
    signalReady();
    const design = harness.loadDesign.mock.calls[0][0];
    expect(design.schemaVersion).toBeGreaterThan(0);
    expect(design.body.rows[0].columns[0].contents).toHaveLength(4);
    expect(JSON.stringify(design)).toContain('Welcome to Acme');
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and export',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    act(() => harness.listeners['design:loaded']());
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and export',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
  });

  it('saves the edited design and reopens it instead of regenerating the template', () => {
    const first = mount();
    signalReady();
    act(() => harness.listeners['design:loaded']());
    const edited = JSON.parse(
      JSON.stringify(createWelcomeDesign()).replace(
        'Welcome to Acme',
        'Welcome back, Ada'
      )
    );
    harness.exportHtml.mockImplementation((callback) =>
      callback({
        design: edited,
        html: '<html><body>Welcome back, Ada</body></html>',
      })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Exported output',
        }) as HTMLTextAreaElement
      ).value
    ).toContain('Welcome back, Ada');
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)!).design
    ).toEqual(edited);
    fireEvent.change(screen.getByRole('combobox', { name: 'Output' }), {
      target: { value: 'json' },
    });
    expect(
      JSON.parse(
        (
          screen.getByRole('textbox', {
            name: 'Exported output',
          }) as HTMLTextAreaElement
        ).value
      )
    ).toEqual(edited);
    first.unmount();
    mount();
    signalReady();
    expect(harness.loadDesign).toHaveBeenLastCalledWith(edited);
  });

  it.each(['{broken', JSON.stringify({ version: 1, design: {} })])(
    'clears invalid saved data and only warns once: %s',
    (saved) => {
      window.localStorage.setItem(STORAGE_KEY, saved);
      window.localStorage.setItem('other-design', 'keep me');
      const first = mount();
      signalReady();
      expect(screen.getByRole('alert').textContent).toContain('Could not read');
      expect(JSON.stringify(harness.loadDesign.mock.calls[0][0])).toContain(
        'Welcome to Acme'
      );
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem('other-design')).toBe('keep me');
      first.unmount();
      mount();
      signalReady();
      expect(screen.queryByRole('alert')).toBeNull();
    }
  );

  it('still loads the template when removing corrupt data is blocked', () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken');
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    mount();
    signalReady();
    expect(screen.getByRole('alert').textContent).toContain('Could not read');
    expect(JSON.stringify(harness.loadDesign.mock.calls[0][0])).toContain(
      'Welcome to Acme'
    );
  });

  it('does not discard saved data when reading storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    mount();
    signalReady();
    expect(remove).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('Could not read');
    expect(JSON.stringify(harness.loadDesign.mock.calls[0][0])).toContain(
      'Welcome to Acme'
    );
  });

  it('times out, retries, and ignores the old callback during the retry', () => {
    vi.useFakeTimers();
    const callbacks: Parameters<Editor['exportHtml']>[0][] = [];
    harness.exportHtml.mockImplementation((callback) =>
      callbacks.push(callback)
    );
    mount();
    signalReady();
    act(() => harness.listeners['design:loaded']());
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    expect(
      (screen.getByRole('button', { name: 'Exporting…' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    act(() => vi.advanceTimersByTime(30_000));
    expect(screen.getByRole('alert').textContent).toContain('Export timed out');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    const design = createWelcomeDesign();
    act(() =>
      callbacks[0]({ design, html: 'Stale export', chunks: {} } as Parameters<
        (typeof callbacks)[0]
      >[0])
    );
    expect(
      (screen.getByRole('button', { name: 'Exporting…' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    act(() =>
      callbacks[1]({ design, html: 'Latest export', chunks: {} } as Parameters<
        (typeof callbacks)[1]
      >[0])
    );
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Exported output',
        }) as HTMLTextAreaElement
      ).value
    ).toBe('Latest export');
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)!).design
    ).toEqual(design);
    act(() => vi.advanceTimersByTime(30_000));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and export',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
  });

  it('cancels an outstanding export on unmount', () => {
    vi.useFakeTimers();
    let callback!: Parameters<Editor['exportHtml']>[0];
    harness.exportHtml.mockImplementation((value) => {
      callback = value;
    });
    const view = mount();
    signalReady();
    act(() => harness.listeners['design:loaded']());
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
    act(() =>
      callback({
        design: createWelcomeDesign(),
        html: 'Late export',
        chunks: {},
      } as Parameters<typeof callback>[0])
    );
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('allows retrying after an export error', () => {
    mount();
    signalReady();
    act(() => harness.listeners['design:loaded']());
    harness.exportHtml.mockImplementationOnce(() => {
      throw new Error('Export failed');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    expect(screen.getByRole('alert').textContent).toContain('Could not export');
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and export',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(
      (screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement)
        .disabled
    ).toBe(false);
  });

  it('keeps exports available when storage writes fail', () => {
    mount();
    signalReady();
    act(() => harness.listeners['design:loaded']());
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save and export' }));
    expect(screen.getByRole('alert').textContent).toContain('Export succeeded');
    expect(
      (screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement)
        .disabled
    ).toBe(false);
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and export',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
  });
});
