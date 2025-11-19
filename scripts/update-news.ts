import 'dotenv/config'
import { updateNews } from '../src/actions/news'

async function main() {
  console.log('Updating news...')
  const result = await updateNews()
  if (result.success) {
    console.log(`✅ News updated successfully! Added: ${result.added}, Skipped: ${result.skipped}`)
  } else {
    console.error('❌ Failed to update news:', result.error)
    process.exit(1)
  }
}

main()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })

