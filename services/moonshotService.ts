import { MPFFund, Scenario, ScenarioAllocation } from '../types';

// NOTE: In a production app, never hardcode API keys on the client. 
// This should be proxied through a backend.
// Using the key provided in the prompt for this specific task as a default/fallback.
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const DEFAULT_KIMI_API_KEY = 'sk-Q7BMmOvpJH77xzGirIqwNg6EyBVXvmmDmA15T2MY17sVvePN'; 

export const callKimiAPI = async (userMessage: string, contextFunds: MPFFund[], history: any[], apiKey?: string): Promise<string> => {
  const fundContext = contextFunds.slice(0, 30).map(f => 
    `${f.constituent_fund} (${f.mpf_trustee}): 1Y=${f.annualized_return_1y}%, 5Y=${f.annualized_return_5y}%, FER=${f.latest_fer}%, Risk=${f.risk_class}`
  ).join('\n');

  const systemPrompt = `You are a professional Hong Kong MPF investment advisor. 
  Data provided:
  ${fundContext}
  
  Instructions:
  - Provide optimization recommendations.
  - If recommending a portfolio, break it down into "Scenarios" (e.g., Scenario 1: Aggressive).
  - For each scenario, list specific funds and their allocation percentages clearly (e.g., "Manulife MPF Core Accumulation Fund (40%)").
  - Mention the expected 1Y return and FER for the scenario.
  - Support English and Traditional Chinese.
  `;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6), // Keep last 6 messages
    { role: 'user', content: userMessage }
  ];

  // Use user-provided key if available, otherwise fallback to default
  const token = (apiKey && apiKey.trim().length > 0) ? apiKey : DEFAULT_KIMI_API_KEY;

  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Kimi API Error:', error);
    throw error;
  }
};

export const parseResponseForVisualization = (responseText: string, allFunds: MPFFund[]): { text: string, scenarios: Scenario[] } => {
  const scenarios: Scenario[] = [];
  
  // Regex to identify scenarios like "Scenario 1", "Option A", "方案一"
  const scenarioRegex = /(?:Scenario|Option|方案)\s*(\d+|[A-C])[:\-]?\s*([^\n]+)/gi;
  let match;
  
  // Split text by scenarios to parse allocations within each block
  const splitText = responseText.split(/(?:Scenario|Option|方案)\s*(?:\d+|[A-C])/i);
  
  // Skip the first chunk (intro text)
  for (let i = 1; i < splitText.length; i++) {
    const segment = splitText[i];
    const allocations: ScenarioAllocation[] = [];
    
    // Find funds and percentages in this segment
    allFunds.forEach(fund => {
      // Create a simplified name matcher (e.g., "Manulife Core Accumulation" matches "Manulife MPF Core Accumulation Fund")
      const simpleName = fund.constituent_fund.replace(/MPF|Fund|\(DIS\)/gi, '').trim().split(' ').slice(0, 3).join(' ');
      
      // Look for fund name AND a percentage nearby
      if (segment.includes(simpleName) || segment.includes(fund.constituent_fund)) {
        // Regex for "40%" or "(40%)" close to the fund name is hard, 
        // simplified: scan the segment for "X%" and associate with closest fund mentioned.
        // For this demo, we'll iterate lines.
      }
    });

    // Line-by-line parsing for robustness
    const lines = segment.split('\n');
    lines.forEach(line => {
      const percentMatch = line.match(/(\d+(?:\.\d+)?)%/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        // Find which fund is in this line
        const foundFund = allFunds.find(f => line.includes(f.constituent_fund) || (line.length > 10 && f.constituent_fund.includes(line.trim())));
        // Fallback: check simplistic fuzzy match
        const foundFundFuzzy = !foundFund ? allFunds.find(f => {
            const keywords = f.constituent_fund.split(' ');
            return keywords.filter(k => k.length > 3 && line.includes(k)).length >= 2;
        }) : null;

        const fund = foundFund || foundFundFuzzy;

        if (fund) {
            allocations.push({
                fund,
                allocation: percent,
                return1Y: fund.annualized_return_1y,
                return5Y: fund.annualized_return_5y,
                fer: fund.latest_fer
            });
        }
      }
    });

    if (allocations.length > 0) {
      scenarios.push({
        number: i,
        title: `Scenario ${i}`,
        allocations,
        text: segment.slice(0, 150) + '...', // Preview
        weightedFER: allocations.reduce((acc, curr) => acc + (curr.fer * (curr.allocation/100)), 0)
      });
    }
  }

  return {
    text: responseText,
    scenarios
  };
};