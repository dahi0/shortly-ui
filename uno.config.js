import { defineConfig, presetWind4 } from 'unocss';

module.exports = defineConfig({
  cli: {
    entry: {
      patterns: [
        "src/ui/**/*.{html,ejs}"
      ],
      outFile: "src/ui/app.css"
    }
  },
  presets: [
    presetWind4()
  ]
});
