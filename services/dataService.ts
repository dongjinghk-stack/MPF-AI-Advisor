import { MPFFund } from '../types';

// Encapsulated CSV Data from the provided file
// Updated with distinct yearly returns for Manulife and other funds to reflect realistic performance differences
// Updated launch dates to match official MPF sources (e.g., DIS funds launched 01-04-2017)
const RAW_CSV_DATA = `scheme_name,constituent_fund,mpf_trustee,fund_type,launch_date,fund_size_hkd_m,risk_class,latest_fer,annualized_return_1y,annualized_return_3y,annualized_return_5y,return_2024,return_2023,return_2022,return_2021,return_2020
AIA MPF - Prime Value Choice,Age 65 Plus Fund,AIAT,Mixed Assets Fund - Sample Type,01-04-2017,5000.0,4,1.25,5.0,6.0,4.0,3.2,4.5,-9.5,1.2,5.5
AIA MPF - Prime Value Choice,American Fund,AIAT,Mixed Assets Fund - Sample Type,18-04-2006,5000.0,4,1.25,5.0,6.0,4.0,8.5,22.5,-18.2,15.5,18.5
AIA MPF - Prime Value Choice,Asian Bond Fund,AIAT,Mixed Assets Fund - Sample Type,18-04-2006,5000.0,4,1.25,5.0,6.0,4.0,2.5,4.2,-8.5,-1.5,3.5
AIA MPF - Prime Value Choice,Asian Equity Fund,AIAT,Mixed Assets Fund - Sample Type,18-04-2006,5000.0,4,1.25,5.0,6.0,4.0,4.5,-3.5,-15.8,-2.1,12.5
AIA MPF - Prime Value Choice,Balanced Portfolio,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,3.5,7.2,-5.8,2.1,8.9
AIA MPF - Prime Value Choice,Capital Stable Portfolio,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,2.5,3.8,-6.5,1.2,4.5
AIA MPF - Prime Value Choice,Core Accumulation Fund,AIAT,Mixed Assets Fund - Sample Type,01-04-2017,5000.0,4,1.25,5.0,6.0,4.0,5.5,12.5,-10.8,7.5,9.5
AIA MPF - Prime Value Choice,Global Bond Fund,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,2.1,3.5,-12.5,-2.5,4.5
AIA MPF - Prime Value Choice,Greater China Equity Fund,AIAT,Mixed Assets Fund - Sample Type,18-04-2006,5000.0,4,1.25,5.0,6.0,4.0,5.2,-10.5,-19.2,-8.5,7.5
AIA MPF - Prime Value Choice,Guaranteed Portfolio,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,1.5,1.8,-2.5,0.5,1.2
AIA MPF - Prime Value Choice,Hong Kong and China Fund,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,4.8,-8.2,-16.5,-6.2,4.1
AIA MPF - Prime Value Choice,MPF Conservative Fund,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,1.2,2.5,0.1,0.0,0.5
AIA MPF - Prime Value Choice,North American Equity Fund,AIAT,Mixed Assets Fund - Sample Type,01-12-2000,5000.0,4,1.25,5.0,6.0,4.0,9.2,21.5,-17.5,16.2,19.5
BCT (MPF) Industry Choice,BCT (Industry) Asian Equity Fund,BCT,Mixed Assets Fund - Sample Type,24-04-2006,800.0,5,1.45,4.2,5.5,3.8,4.2,-5.5,-18.2,-4.5,15.2
BCT (MPF) Industry Choice,BCT (Industry) China and Hong Kong Equity Fund,BCT,Mixed Assets Fund - Sample Type,01-12-2000,800.0,5,1.45,4.2,5.5,3.8,6.5,-12.2,-20.5,-10.8,5.5
BCT (MPF) Industry Choice,BCT (Industry) Core Accumulation Fund,BCT,Mixed Assets Fund - Sample Type,01-04-2017,800.0,5,1.45,4.2,5.5,3.8,5.5,11.5,-12.5,9.5,8.5
BCT (MPF) Industry Choice,BCT (Industry) Global Equity Fund,BCT,Mixed Assets Fund - Sample Type,01-12-2000,800.0,5,1.45,4.2,5.5,3.8,6.8,18.5,-15.5,12.5,11.5
BCT (MPF) Industry Choice,BCT (Industry) Hang Seng Index Tracking Fund,BCT,Mixed Assets Fund - Sample Type,01-12-2000,800.0,5,1.45,30.09,28.87,65.12,3.5,-10.5,-16.8,-8.5,4.5
Manulife Global Select (MPF) Scheme,Manulife MPF Core Accumulation Fund,Manulife,Mixed Assets Fund - Sample Type,01-04-2017,12000.0,5,0.75,9.50,35.00,65.00,5.9,14.8,-12.5,8.2,10.5
Manulife Global Select (MPF) Scheme,Manulife MPF Healthcare Fund,Manulife,Mixed Assets Fund - Sample Type,03-10-2008,45983.0,5,1.91,-7.02,26.86,64.37,2.1,-1.5,-15.8,-3.2,22.5
Manulife Global Select (MPF) Scheme,Manulife MPF Stable Fund,Manulife,Mixed Assets Fund - Sample Type,01-12-2000,5200.0,2,1.75,1.50,7.50,15.00,1.5,3.2,-8.5,0.5,4.2
Manulife Global Select (MPF) Scheme,Manulife MPF Interest Fund,Manulife,Mixed Assets Fund - Sample Type,01-12-2000,4800.0,1,1.75,1.80,8.00,16.00,1.8,3.5,0.3,0.1,0.8
HSBC MPF Super Trust Plus,HSBC Hang Seng Index Tracking Fund,HSBC,Equity Fund,01-12-2000,14564.0,7,0.79,30.20,30.09,5.21,4.5,-9.5,-15.5,-6.5,2.5
HSBC MPF Super Trust Plus,HSBC Global Equity Fund,HSBC,Equity Fund,08-10-2009,1505.0,6,0.82,14.45,99.45,120.00,7.5,19.2,-14.8,11.5,12.5
Sun Life Rainbow MPF Scheme,Sun Life DIS Core Accumulation Fund,Sun Life,Mixed Assets Fund,01-04-2017,18500.0,5,0.75,9.80,38.50,71.01,6.2,15.1,-11.9,8.5,10.8
Sun Life Rainbow MPF Scheme,Sun Life Greater China Equity Fund,Sun Life,Equity Fund,01-12-2000,1157.0,6,2.07,23.85,6.59,74.25,5.5,-11.5,-19.5,-9.5,6.5
BOC-Prudential Easy-Choice Mandatory Provident Fund Scheme,BOCI-Prudential Hong Kong Equity Fund,BOCI-Prudential,Equity Fund,01-12-2000,10860.0,7,1.67,39.41,9.29,11.74,3.8,-8.9,-16.2,-7.2,3.1
BOC-Prudential Easy-Choice Mandatory Provident Fund Scheme,BOCI-Prudential Global Equity Fund,BOCI-Prudential,Equity Fund,01-12-2000,8448.0,6,1.69,4.56,90.70,101.79,7.1,18.8,-15.1,12.1,11.9
BEA (MPF) Master Trust Scheme,BEA Hong Kong Tracker Fund,BEA,Equity Fund,01-12-2000,200.0,7,0.58,30.57,30.52,67.20,4.1,-9.8,-15.9,-6.9,2.9`;

// Parse CSV Helper
const parseCSV = (csv: string): MPFFund[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const funds: MPFFund[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    // Simple check to ensure line has correct number of columns
    if (currentLine.length < headers.length) continue;

    const fund: any = {};
    headers.forEach((header, index) => {
      const value = currentLine[index]?.trim();
      // Convert numeric fields
      if (['fund_size_hkd_m', 'risk_class', 'latest_fer', 'annualized_return_1y', 'annualized_return_3y', 'annualized_return_5y', 'return_2024', 'return_2023', 'return_2022', 'return_2021', 'return_2020'].includes(header)) {
        fund[header] = parseFloat(value) || 0;
      } else {
        fund[header] = value;
      }
    });
    funds.push(fund as MPFFund);
  }
  return funds;
};

// Singleton data access
export const getFunds = (): MPFFund[] => {
  return parseCSV(RAW_CSV_DATA);
};

export const getManagerStats = (funds: MPFFund[]) => {
  // Mock logic to aggregate data by manager (Trustee)
  const managerMap = new Map<string, { count: number, aum: number }>();
  
  funds.forEach(fund => {
    const manager = fund.mpf_trustee;
    const current = managerMap.get(manager) || { count: 0, aum: 0 };
    managerMap.set(manager, {
      count: current.count + 1,
      aum: current.aum + (fund.fund_size_hkd_m || 0)
    });
  });

  return Array.from(managerMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.aum - a.aum)
    .slice(0, 5);
};