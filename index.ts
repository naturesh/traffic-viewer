import { createCanvas } from "canvas";
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Legend, Colors } from "chart.js";
import 'chartjs-adapter-date-fns'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Legend,
  Colors
)

const env_access_token: string = process.env.ACCESS_TOKEN

//@ts-ignore
const repos: string[] = (await Bun.file('watch.txt').text()).split('\n').filter(i => i)


async function get_views(repo: string) {
  let response = await fetch(`https://api.github.com/repos/${repo}/traffic/views`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env_access_token}`
    }
  })

  return (await response.json()).views
}


function create_chart(repositories : any) {
  const dates = Object.values(repositories).flat().map(i => i.timestamp).sort()

  const set = (data: any[]) => dates.map(date => data.find(({timestamp}) => timestamp == date)?.count ?? 0)

  const canvas = createCanvas(1600, 600)
  const chart  = new Chart(
    canvas as any,
    {
      type: 'line',
      data: {
        labels: dates.map(d => new Date(d)),
        datasets: Object.entries(repositories).map(([name, data]) => ({
          label: name,
          data: set(data as any[]),
          tension: 0.1
        }))
      },
      options: {
        devicePixelRatio: 4,
        responsive: false,
        scales: { x: { type: 'time', time: { unit: 'day' }} },
        plugins: {
            legend: {
              position: 'right',
              labels: { font: { size: 24 } }
            }
        },
      }
    }
  )

  //@ts-ignore
  Bun.write('output.png', canvas.toBuffer('image/png'))
  chart.destroy()

}



let repositories = {}

for (let repo of repos) {
  repositories[repo] = await get_views(repo)
}

create_chart(repositories)
