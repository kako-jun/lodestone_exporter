const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const localPkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"), "utf-8"));

const input_dir1 = path.join(__dirname, "./ts/background.ts");
const input_dir2 = path.join(__dirname, "./ts/content_script.ts");
const output_dir = path.join(__dirname, "./dist/js");

const common_config = {
  entryPoints: [input_dir1, input_dir2],
  bundle: true,
  format: "cjs",
  platform: "node",
  outdir: output_dir,
  external: Object.keys({
    ...(localPkgJson.dependencies || {}),
    ...(localPkgJson.devDependencies || {}),
    ...(localPkgJson.peerDependencies || {}),
  }),
};

esbuild.build({
  ...common_config,
});
