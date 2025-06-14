# GitHub Repository Traffic Viewer

**A project that automatically visualizes your GitHub repository traffic (views) and displays it in the README.**



[![Traffic View](https://github.com/naturesh/traffic-viewer/blob/main/output.png?raw=true)](https://github.com/naturesh/traffic-viewer)

## Key Features

- Automatically collects and visualizes traffic data via GitHub Actions
- Uses Bun and Chart.js to generate traffic trend images
- Automatically updates README with the generated image
- Scheduled daily updates and commits at midnight (UTC)

---

## 🛠️ How to Use

1. Fork or clone this project to your repository
2. Generate a GitHub Personal Access Token (PAT) ( `public_repo` scope ) and save it in Actions Secrets ( name : `ACCESS_TOKEN` )
   - `traffic-viewer Settings` -> `Secrets and variables` -> `Actions` -> `New Repository Secret`
   - `traffic-viewer Settings` -> `Actions` -> `General` -> `Workflow permissions` -> `Read and write permissions`
    
3. Specify a list of repositories to collect traffic data from workflow environment variables within `watch.txt`
4. The workflow runs to generate traffic images and updates the README automatically

<br>

```
You can display the traffic view image anywhere by adding the following GitHub markdown code:

[![Traffic View](https://github.com/{username}/traffic-viewer/blob/main/output.png?raw=true)](https://github.com/{username})

Replace `{username}` with your GitHub username.
```

<br>


## ⚙️ Tech Stack

- **Bun** - Fast JavaScript runtime
- **Chart.js** - Traffic data visualization
- **GitHub Actions** - Automation and deployment



