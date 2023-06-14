const copy = require('rollup-plugin-copy');
const replace = require('@rollup/plugin-replace');

module.exports = {
  rollup(config, opts) {
    config.plugins = config.plugins.map((p) =>
      p.name === 'replace'
        ? replace({
            'process.env.NODE_ENV': JSON.stringify(opts.env),
            preventAssignment: true,
          })
        : p
    );

    config.plugins.push(
      copy({
        targets: [{ src: 'src/*.d.ts', dest: 'dist/' }],
      })
    );

    return config;
  },
};
