# Interactive museum machine models

Upload one GLB model for each machine:

- `surveyor-3/model.glb`
- `apollo-15-lrv/model.glb`
- `sojourner/model.glb`
- `opportunity/model.glb`
- `insight/model.glb`
- `pioneer-10/model.glb`

The React model viewer automatically looks for `/assets/models/{machine-id}/model.glb`.
Use binary **GLB (glTF 2.0)** files that include textures/materials; export from Blender with **Format: glTF Binary (.glb)**.
Keep the model centered and correctly scaled when exporting. The viewer calculates a camera framing from its bounding box.
Avoid enormous polygon counts and textures, especially for phones. Aim for a few MB per model where practical.
Only use models you have permission to distribute and document their authors/licenses.
No 3D model is bundled yet; exhibits remain functional and show a placeholder until one is uploaded.

If your model is OBJ, FBX, or .blend, convert it to .glb before upload.
