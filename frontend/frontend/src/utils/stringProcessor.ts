export const removeHtml = (text: string): string => {
    if (!text) return '';

    return text
        .replace(/<[^>]+>/g, '')
        .replace(/</g, '') 
        .replace(/>/g, '') 
        .replace(/&[a-zA-Z0-9#]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

}

// 倒排索引
export const reconstructAbstract = (invertedIndex: any): string => {
    const positions: { word: string, position: number }[] = [];
    for (const [word, posArray] of Object.entries(invertedIndex)) {
        (posArray as number[]).forEach(pos => {
            positions.push({ word, position: pos });
        });
    }

    return positions
        .sort((a, b) => a.position - b.position)
        .map(p => p.word)
        .join(' ');
}