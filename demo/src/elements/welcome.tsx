import {
  Email,
  Row,
  Column,
  Heading,
  Paragraph,
  Button,
  renderToJson,
} from '@unlayer/react-elements';
import type { EmailDesign } from './storage';

export function createWelcomeDesign() {
  return renderToJson(
    <Email
      contentWidth="600px"
      backgroundColor="#f4f6f8"
      fontFamily={{ label: 'Arial', value: 'arial,helvetica,sans-serif' }}
      previewText="Your workspace is ready."
    >
      <Row padding="32px" backgroundColor="#ffffff">
        <Column>
          <Heading level="h1" fontSize="28px">
            Welcome to Acme
          </Heading>
          <Paragraph html="Your workspace is ready. Invite your team and start your first project." />
          <Button
            href="https://example.com/workspace"
            backgroundColor="#0879a1"
            color="#ffffff"
          >
            Open your workspace
          </Button>
          <Paragraph html="This template was written in React. You can edit every block in the visual editor." />
        </Column>
      </Row>
    </Email>
  ) as EmailDesign; // Bridge Elements 0.1.22 design types to the editor.
}
