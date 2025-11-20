import { createCanvas } from "canvas";
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Legend, Colors, LogarithmicScale } from "chart.js";
import 'chartjs-adapter-date-fns'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Legend,
  Colors,
  LogarithmicScale
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

  const set = (data: any[]) => dates.map(date => (data.find(({timestamp}) => timestamp == date)?.count ?? 0) + 1)

  // ⬜ 적용할 무채색(모노크롬) 팔레트
  const colors = [
    '#1a1a1a', 
    '#4d4d4d', 
    '#808080', 
    '#b3b3b3', 
    '#e6e6e6', 
    '#cccccc'
  ];
  let colorIndex = 0;

  const canvas = createCanvas(1600, 600)
  const chart  = new Chart(
    canvas as any,
    {
      type: 'line',
      data: {
        labels: dates.map(d => new Date(d)),
        datasets: Object.entries(repositories).map(([name, data]) => {
          const color = colors[colorIndex % colors.length]; 
          colorIndex++;

          return {
            label: name,
            data: set(data as any[]),
            tension: 0.2,
            // ✨ 데이터셋 색상만 무채색으로 변경
            borderColor: color,         
            backgroundColor: color,     
            pointRadius: 4,             
            pointHoverRadius: 6,        
          }
        })
      },
      options: {
        devicePixelRatio: 4,
        responsive: false,
        scales: { 
          x: { type: 'time', time: { unit: 'day' }},
          y: { type: 'logarithmic', grid: { display: false }, ticks: { display: false }, border: { display: false }}
        },
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
