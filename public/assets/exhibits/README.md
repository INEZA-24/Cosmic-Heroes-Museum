# Mission visual archive

Each machine has a folder with `gallery.json`.
Add images (.jpg, .png, .webp) or short videos (.mp4, .webm) beside that file, then list them in `items`.

Example: `public/assets/exhibits/opportunity/gallery.json`:
```json
{
  "items": [
    {
      "type": "image",
      "file": "opportunity-panorama.jpg",
      "caption": "Opportunity's view from the Martian surface",
      "credit": "NASA/JPL-Caltech",
      "sourceUrl": "https://science.nasa.gov/mission/mer-opportunity/"
    },
    {
      "type": "video",
      "file": "mission-short.mp4",
      "caption": "Mission overview",
      "credit": "Used with permission"
    }
  ]
}
```

The gallery appears automatically once `items` contains supported files. Use images/media with verified permission, attribution and original sources. Only trusted direct HTTPS links should be used in `sourceUrl`; do not embed external scripts.
The gallery ignores invalid file names. Local files are served under `/assets/exhibits/{machine-id}/`.
