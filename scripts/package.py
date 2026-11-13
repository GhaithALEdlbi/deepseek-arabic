"""Validate and package the unpacked extension using only Python's stdlib."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from hashlib import sha256

project = Path(__file__).resolve().parents[1]
source = project / "deepseek-arabic"
manifest = json.loads((source / "manifest.json").read_text())
files = {"manifest.json", manifest["action"]["default_popup"], "popup.css", "popup.js", "LICENSE"}
files.update(manifest["icons"].values())
files.update(manifest["action"]["default_icon"].values())
for entry in manifest["content_scripts"]:
    files.update(entry.get("js", []))
    files.update(entry.get("css", []))
for name in files:
    if not (source / name).is_file():
        raise SystemExit(f"Missing extension file: {name}")
assert manifest["manifest_version"] == 3
assert manifest["permissions"] == ["storage"]
assert manifest["content_scripts"][0]["matches"] == ["https://chat.deepseek.com/*"]
output = project / "dist"
output.mkdir(exist_ok=True)
targets = []
for store in (False, True):
    suffix = "-store" if store else ""
    target = output / f"deepseek-arabic-{manifest['version']}{suffix}.zip"
    with ZipFile(target, "w", ZIP_DEFLATED) as archive:
        for name in sorted(files):
            archive.write(source / name, name if store else "deepseek-arabic/" + name)
        if not store:
            archive.write(project / "docs" / "INSTALL.ar.md", "README.md")
    with ZipFile(target) as archive:
        if archive.testzip() is not None:
            raise SystemExit(f"Corrupt ZIP: {target.name}")
        expected = "manifest.json" if store else "deepseek-arabic/manifest.json"
        if expected not in archive.namelist():
            raise SystemExit(f"Manifest is in the wrong location: {target.name}")
    targets.append(target)
    print(f"Validated {len(files)} files. Created {target}")
(output / "SHA256SUMS.txt").write_text("".join(
    f"{sha256(target.read_bytes()).hexdigest()}  {target.name}\n" for target in targets
))
