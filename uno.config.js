import { defineConfig, presetWind4 } from 'unocss';
import { presetIcons } from 'unocss'

export default defineConfig({
  cli: {
    entry: {
      patterns: [
        "src/ui/**/*.{html,ejs}"
      ],
      outFile: "src/ui/app.css"
    }
  },
  presets: [
    presetWind4(),
    presetIcons({})
  ]
});
