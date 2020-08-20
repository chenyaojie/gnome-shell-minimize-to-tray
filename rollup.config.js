import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';

const buildPath = 'dist';

const globals = {
  '@imports/Gio-2.0': 'imports.gi.Gio',
  '@imports/Gdk-3.0': 'imports.gi.Gdk',
  '@imports/Gtk-3.0': 'imports.gi.Gtk',
  '@imports/GdkPixbuf-2.0': 'imports.gi.GdkPixbuf',
  '@imports/GLib-2.0': 'imports.gi.GLib',
  '@imports/St-1.0': 'imports.gi.St',
  '@imports/Shell-0.1': 'imports.gi.Shell',
  '@imports/Meta-6': 'imports.gi.Meta',
  '@imports/Wnck-3.0': 'imports.gi.Wnck',
  '@imports/Clutter-6': 'imports.gi.Clutter',
};

const external = Object.keys(globals);

const banner = [
  'imports.gi.versions.Wnck = \'3.0\';',
].join('\n');

const prefsFooter = [
  'var init = prefs.init;',
  'var buildPrefsWidget = prefs.buildPrefsWidget;',
].join('\n')

export default [
  {
    input: 'src/extension.ts',
    output: {
      file: `${buildPath}/extension.js`,
      format: 'iife',
      name: 'init',
      banner,
      exports: 'default',
      globals,
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      scss({
        output: `${buildPath}/stylesheet.css`,
        failOnError: true,
        watch: 'src/styles',
      }),
      copy({
        targets: [
          { src: './resources/metadata.json', dest: `${buildPath}` },
          { src: './resources/schemas', dest: `${buildPath}` },
        ],
      }),
    ],
  },
  {
    input: 'src/prefs/prefs.ts',
    output: {
      file: `${buildPath}/prefs.js`,
      format: 'iife',
      exports: 'default',
      name: 'prefs',
      banner,
      footer: prefsFooter,
      globals,
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      copy({
        targets: [{ src: './resources/ui', dest: `${buildPath}` }],
      }),
    ],
  },
];
