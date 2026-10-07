// Adds `readingMinutes` to a note's YAML frontmatter at compile time, so the
// number is identical in the prerendered HTML and the hydrated client.
export const WORDS_PER_MINUTE = 230

export function countWords(node) {
  if (node.type === 'yaml') return 0
  if (typeof node.value === 'string' && (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code')) {
    return node.value.split(/\s+/).filter(Boolean).length
  }
  return (node.children ?? []).reduce((sum, child) => sum + countWords(child), 0)
}

export default function remarkReadingTime() {
  return (tree) => {
    const yaml = tree.children.find((n) => n.type === 'yaml')
    if (!yaml) return
    const minutes = Math.max(1, Math.round(countWords(tree) / WORDS_PER_MINUTE))
    yaml.value += `\nreadingMinutes: ${minutes}`
  }
}
