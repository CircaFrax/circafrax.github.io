// 1. Il charge ./fiches/index.json
let FICHES = await fetch('./fiches/index.json').then(r=>r.json())

// 2. Il compte le plus de mots-clés qui matchent
function scoreFiche(fiche, tokens) {
  const haystack = `${fiche.nom} ${fiche.url} ${fiche.resume} ${fiche.tags.join(' ')}`.toLowerCase()
  let score = 0
  tokens.forEach(t => { if(haystack.includes(t)) score++ })
  return score
}

// 3. Tri classique : plus de mots qui matchent en premier
scored.sort((a,b) => b.score - a.score)
