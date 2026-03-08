import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Basic text analysis
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const words = content.split(/\s+/).filter((w: string) => w.trim().length > 0);
    const paragraphs = content.split(/\n\n+/).filter((p: string) => p.trim().length > 0);

    const sentenceCount = sentences.length;
    const wordCount = words.length;
    const paragraphCount = paragraphs.length;

    // Calculate averages
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const avgSentencesPerParagraph = paragraphCount > 0 ? sentenceCount / paragraphCount : 0;

    // Count syllables (simplified)
    const syllableCount = words.reduce((count: number, word: string) => {
      return count + countSyllables(word);
    }, 0);

    // Flesch Reading Ease Score
    // Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const fleschScore = sentenceCount > 0 && wordCount > 0
      ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount)
      : 0;

    // Flesch-Kincaid Grade Level
    const gradeLevel = sentenceCount > 0 && wordCount > 0
      ? 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59
      : 0;

    // Determine readability level
    let readabilityLevel = '';
    let readabilityDescription = '';
    
    if (fleschScore >= 90) {
      readabilityLevel = 'Very Easy';
      readabilityDescription = '5th grade level';
    } else if (fleschScore >= 80) {
      readabilityLevel = 'Easy';
      readabilityDescription = '6th grade level';
    } else if (fleschScore >= 70) {
      readabilityLevel = 'Fairly Easy';
      readabilityDescription = '7th grade level';
    } else if (fleschScore >= 60) {
      readabilityLevel = 'Standard';
      readabilityDescription = '8th-9th grade level';
    } else if (fleschScore >= 50) {
      readabilityLevel = 'Fairly Difficult';
      readabilityDescription = '10th-12th grade level';
    } else if (fleschScore >= 30) {
      readabilityLevel = 'Difficult';
      readabilityDescription = 'College level';
    } else {
      readabilityLevel = 'Very Difficult';
      readabilityDescription = 'College graduate level';
    }

    // Calculate score (0-100)
    const score = Math.max(0, Math.min(100, fleschScore));

    const issues = [];
    if (avgWordsPerSentence > 25) issues.push('Sentences are too long on average');
    if (avgWordsPerSentence < 10) issues.push('Sentences are too short on average');
    if (wordCount < 300) issues.push('Content is too short for proper SEO');
    if (fleschScore < 60) issues.push('Content may be too difficult to read');

    return NextResponse.json({
      success: true,
      statistics: {
        wordCount,
        sentenceCount,
        paragraphCount,
        syllableCount,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        avgSentencesPerParagraph: Math.round(avgSentencesPerParagraph * 10) / 10,
      },
      readability: {
        fleschScore: Math.round(fleschScore * 10) / 10,
        gradeLevel: Math.round(gradeLevel * 10) / 10,
        level: readabilityLevel,
        description: readabilityDescription,
      },
      score: Math.round(score),
      status: score >= 70 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR',
      issues,
      recommendations: [
        ...(avgWordsPerSentence > 25 ? ['Break long sentences into shorter ones'] : []),
        ...(wordCount < 300 ? ['Add more content (aim for 300+ words)'] : []),
        ...(fleschScore < 60 ? ['Simplify language and use shorter sentences'] : []),
        ...(paragraphCount < 3 ? ['Break content into more paragraphs'] : []),
      ],
    });
  } catch (error) {
    console.error('Readability Analyzer error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze readability' },
      { status: 500 }
    );
  }
}

// Simplified syllable counter
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}
