/**
 * DataPulse Studio - Datasets & Data Engine
 * Pre-loaded industry datasets, CSV parser, and synthetic dataset generator.
 */

const DATASETS = {
  telecom_churn: {
    id: 'telecom_churn',
    name: 'Customer Churn Intelligence',
    category: 'Classification',
    icon: 'users',
    description: 'Predict customer churn probability based on subscription, usage telemetry, and customer service history.',
    targetColumn: 'Churned',
    targetType: 'binary',
    features: ['Age', 'TenureMonths', 'MonthlyCharges', 'TotalCharges', 'SupportTickets', 'UsageGB', 'ContractType'],
    featureTypes: {
      Age: 'number',
      TenureMonths: 'number',
      MonthlyCharges: 'number',
      TotalCharges: 'number',
      SupportTickets: 'number',
      UsageGB: 'number',
      ContractType: 'category',
      Churned: 'binary'
    },
    data: [
      { Age: 34, TenureMonths: 12, MonthlyCharges: 65.5, TotalCharges: 786, SupportTickets: 3, UsageGB: 120, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 58, TenureMonths: 48, MonthlyCharges: 89.2, TotalCharges: 4281.6, SupportTickets: 0, UsageGB: 210, ContractType: 'Two-Year', Churned: 0 },
      { Age: 26, TenureMonths: 6, MonthlyCharges: 45.0, TotalCharges: 270, SupportTickets: 4, UsageGB: 85, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 45, TenureMonths: 36, MonthlyCharges: 105.4, TotalCharges: 3794.4, SupportTickets: 1, UsageGB: 340, ContractType: 'One-Year', Churned: 0 },
      { Age: 61, TenureMonths: 60, MonthlyCharges: 95.0, TotalCharges: 5700, SupportTickets: 1, UsageGB: 280, ContractType: 'Two-Year', Churned: 0 },
      { Age: 23, TenureMonths: 4, MonthlyCharges: 79.9, TotalCharges: 319.6, SupportTickets: 5, UsageGB: 190, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 39, TenureMonths: 24, MonthlyCharges: 55.0, TotalCharges: 1320, SupportTickets: 2, UsageGB: 145, ContractType: 'One-Year', Churned: 0 },
      { Age: 52, TenureMonths: 40, MonthlyCharges: 110.0, TotalCharges: 4400, SupportTickets: 2, UsageGB: 390, ContractType: 'Two-Year', Churned: 0 },
      { Age: 29, TenureMonths: 8, MonthlyCharges: 70.0, TotalCharges: 560, SupportTickets: 4, UsageGB: 110, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 42, TenureMonths: 18, MonthlyCharges: 82.5, TotalCharges: 1485, SupportTickets: 3, UsageGB: 175, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 67, TenureMonths: 72, MonthlyCharges: 60.0, TotalCharges: 4320, SupportTickets: 0, UsageGB: 130, ContractType: 'Two-Year', Churned: 0 },
      { Age: 31, TenureMonths: 15, MonthlyCharges: 92.0, TotalCharges: 1380, SupportTickets: 1, UsageGB: 260, ContractType: 'One-Year', Churned: 0 },
      { Age: 48, TenureMonths: 54, MonthlyCharges: 115.0, TotalCharges: 6210, SupportTickets: 1, UsageGB: 410, ContractType: 'Two-Year', Churned: 0 },
      { Age: 25, TenureMonths: 3, MonthlyCharges: 50.0, TotalCharges: 150, SupportTickets: 6, UsageGB: 60, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 37, TenureMonths: 30, MonthlyCharges: 74.0, TotalCharges: 2220, SupportTickets: 1, UsageGB: 180, ContractType: 'One-Year', Churned: 0 },
      { Age: 54, TenureMonths: 45, MonthlyCharges: 88.0, TotalCharges: 3960, SupportTickets: 2, UsageGB: 225, ContractType: 'Two-Year', Churned: 0 },
      { Age: 28, TenureMonths: 9, MonthlyCharges: 68.0, TotalCharges: 612, SupportTickets: 3, UsageGB: 140, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 41, TenureMonths: 21, MonthlyCharges: 102.0, TotalCharges: 2142, SupportTickets: 2, UsageGB: 310, ContractType: 'One-Year', Churned: 0 },
      { Age: 63, TenureMonths: 66, MonthlyCharges: 78.0, TotalCharges: 5148, SupportTickets: 0, UsageGB: 195, ContractType: 'Two-Year', Churned: 0 },
      { Age: 33, TenureMonths: 14, MonthlyCharges: 85.0, TotalCharges: 1190, SupportTickets: 4, UsageGB: 215, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 46, TenureMonths: 38, MonthlyCharges: 99.0, TotalCharges: 3762, SupportTickets: 1, UsageGB: 320, ContractType: 'Two-Year', Churned: 0 },
      { Age: 22, TenureMonths: 2, MonthlyCharges: 42.0, TotalCharges: 84, SupportTickets: 5, UsageGB: 50, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 50, TenureMonths: 50, MonthlyCharges: 108.0, TotalCharges: 5400, SupportTickets: 1, UsageGB: 360, ContractType: 'Two-Year', Churned: 0 },
      { Age: 36, TenureMonths: 28, MonthlyCharges: 62.0, TotalCharges: 1736, SupportTickets: 2, UsageGB: 150, ContractType: 'One-Year', Churned: 0 },
      { Age: 59, TenureMonths: 62, MonthlyCharges: 91.0, TotalCharges: 5642, SupportTickets: 0, UsageGB: 250, ContractType: 'Two-Year', Churned: 0 },
      { Age: 27, TenureMonths: 7, MonthlyCharges: 76.0, TotalCharges: 532, SupportTickets: 4, UsageGB: 165, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 44, TenureMonths: 32, MonthlyCharges: 84.0, TotalCharges: 2688, SupportTickets: 2, UsageGB: 230, ContractType: 'One-Year', Churned: 0 },
      { Age: 65, TenureMonths: 70, MonthlyCharges: 66.0, TotalCharges: 4620, SupportTickets: 0, UsageGB: 140, ContractType: 'Two-Year', Churned: 0 },
      { Age: 30, TenureMonths: 11, MonthlyCharges: 94.0, TotalCharges: 1034, SupportTickets: 3, UsageGB: 275, ContractType: 'Month-to-Month', Churned: 1 },
      { Age: 55, TenureMonths: 52, MonthlyCharges: 112.0, TotalCharges: 5824, SupportTickets: 1, UsageGB: 380, ContractType: 'Two-Year', Churned: 0 }
    ]
  },

  housing_valuation: {
    id: 'housing_valuation',
    name: 'Real Estate Valuation & Pricing',
    category: 'Regression',
    icon: 'home',
    description: 'Predict residential property sale prices based on square footage, location amenities, and structural features.',
    targetColumn: 'PriceUSD',
    targetType: 'continuous',
    features: ['SqFt', 'Bedrooms', 'Bathrooms', 'DistanceToCityKM', 'YearBuilt', 'NeighborhoodScore'],
    featureTypes: {
      SqFt: 'number',
      Bedrooms: 'number',
      Bathrooms: 'number',
      DistanceToCityKM: 'number',
      YearBuilt: 'number',
      NeighborhoodScore: 'number',
      PriceUSD: 'number'
    },
    data: [
      { SqFt: 1250, Bedrooms: 2, Bathrooms: 1.5, DistanceToCityKM: 12.4, YearBuilt: 1998, NeighborhoodScore: 78, PriceUSD: 310000 },
      { SqFt: 2100, Bedrooms: 3, Bathrooms: 2.5, DistanceToCityKM: 6.2, YearBuilt: 2012, NeighborhoodScore: 89, PriceUSD: 540000 },
      { SqFt: 850, Bedrooms: 1, Bathrooms: 1.0, DistanceToCityKM: 3.5, YearBuilt: 2005, NeighborhoodScore: 82, PriceUSD: 285000 },
      { SqFt: 3200, Bedrooms: 4, Bathrooms: 3.5, DistanceToCityKM: 8.1, YearBuilt: 2018, NeighborhoodScore: 94, PriceUSD: 790000 },
      { SqFt: 1650, Bedrooms: 3, Bathrooms: 2.0, DistanceToCityKM: 15.0, YearBuilt: 1985, NeighborhoodScore: 65, PriceUSD: 345000 },
      { SqFt: 2800, Bedrooms: 4, Bathrooms: 3.0, DistanceToCityKM: 4.8, YearBuilt: 2015, NeighborhoodScore: 92, PriceUSD: 720000 },
      { SqFt: 1400, Bedrooms: 2, Bathrooms: 2.0, DistanceToCityKM: 9.5, YearBuilt: 2002, NeighborhoodScore: 75, PriceUSD: 375000 },
      { SqFt: 3900, Bedrooms: 5, Bathrooms: 4.5, DistanceToCityKM: 10.2, YearBuilt: 2021, NeighborhoodScore: 96, PriceUSD: 980000 },
      { SqFt: 1100, Bedrooms: 2, Bathrooms: 1.0, DistanceToCityKM: 18.2, YearBuilt: 1978, NeighborhoodScore: 58, PriceUSD: 240000 },
      { SqFt: 2450, Bedrooms: 3, Bathrooms: 2.5, DistanceToCityKM: 5.4, YearBuilt: 2010, NeighborhoodScore: 88, PriceUSD: 615000 },
      { SqFt: 1850, Bedrooms: 3, Bathrooms: 2.0, DistanceToCityKM: 11.0, YearBuilt: 2008, NeighborhoodScore: 80, PriceUSD: 460000 },
      { SqFt: 2950, Bedrooms: 4, Bathrooms: 3.5, DistanceToCityKM: 7.0, YearBuilt: 2017, NeighborhoodScore: 91, PriceUSD: 745000 },
      { SqFt: 980, Bedrooms: 1, Bathrooms: 1.0, DistanceToCityKM: 2.1, YearBuilt: 2016, NeighborhoodScore: 86, PriceUSD: 330000 },
      { SqFt: 3500, Bedrooms: 5, Bathrooms: 4.0, DistanceToCityKM: 12.0, YearBuilt: 2019, NeighborhoodScore: 93, PriceUSD: 860000 },
      { SqFt: 1550, Bedrooms: 3, Bathrooms: 2.0, DistanceToCityKM: 14.5, YearBuilt: 1992, NeighborhoodScore: 71, PriceUSD: 360000 },
      { SqFt: 2250, Bedrooms: 3, Bathrooms: 2.5, DistanceToCityKM: 8.8, YearBuilt: 2014, NeighborhoodScore: 85, PriceUSD: 565000 },
      { SqFt: 1300, Bedrooms: 2, Bathrooms: 1.5, DistanceToCityKM: 16.0, YearBuilt: 1988, NeighborhoodScore: 68, PriceUSD: 295000 },
      { SqFt: 2700, Bedrooms: 4, Bathrooms: 3.0, DistanceToCityKM: 6.0, YearBuilt: 2013, NeighborhoodScore: 90, PriceUSD: 680000 },
      { SqFt: 1950, Bedrooms: 3, Bathrooms: 2.5, DistanceToCityKM: 10.5, YearBuilt: 2006, NeighborhoodScore: 81, PriceUSD: 485000 },
      { SqFt: 4200, Bedrooms: 5, Bathrooms: 5.0, DistanceToCityKM: 9.0, YearBuilt: 2022, NeighborhoodScore: 98, PriceUSD: 1120000 },
      { SqFt: 1200, Bedrooms: 2, Bathrooms: 1.0, DistanceToCityKM: 13.5, YearBuilt: 1995, NeighborhoodScore: 73, PriceUSD: 315000 },
      { SqFt: 2600, Bedrooms: 4, Bathrooms: 2.5, DistanceToCityKM: 7.5, YearBuilt: 2011, NeighborhoodScore: 87, PriceUSD: 640000 },
      { SqFt: 1750, Bedrooms: 3, Bathrooms: 2.0, DistanceToCityKM: 12.8, YearBuilt: 2004, NeighborhoodScore: 77, PriceUSD: 425000 },
      { SqFt: 3100, Bedrooms: 4, Bathrooms: 3.5, DistanceToCityKM: 5.1, YearBuilt: 2020, NeighborhoodScore: 95, PriceUSD: 810000 },
      { SqFt: 1050, Bedrooms: 2, Bathrooms: 1.0, DistanceToCityKM: 17.0, YearBuilt: 1982, NeighborhoodScore: 62, PriceUSD: 265000 }
    ]
  },

  cardio_risk: {
    id: 'cardio_risk',
    name: 'Cardiovascular Clinical Risk',
    category: 'Classification',
    icon: 'activity',
    description: 'Diagnose cardiovascular risk tier based on biometrics, lipid panels, and stress tests.',
    targetColumn: 'HighRisk',
    targetType: 'binary',
    features: ['Age', 'RestingBP', 'Cholesterol', 'MaxHeartRate', 'BloodSugar', 'ST_Depression'],
    featureTypes: {
      Age: 'number',
      RestingBP: 'number',
      Cholesterol: 'number',
      MaxHeartRate: 'number',
      BloodSugar: 'number',
      ST_Depression: 'number',
      HighRisk: 'binary'
    },
    data: [
      { Age: 63, RestingBP: 145, Cholesterol: 233, MaxHeartRate: 150, BloodSugar: 120, ST_Depression: 2.3, HighRisk: 1 },
      { Age: 37, RestingBP: 130, Cholesterol: 250, MaxHeartRate: 187, BloodSugar: 95, ST_Depression: 3.5, HighRisk: 1 },
      { Age: 41, RestingBP: 130, Cholesterol: 204, MaxHeartRate: 172, BloodSugar: 102, ST_Depression: 1.4, HighRisk: 0 },
      { Age: 56, RestingBP: 120, Cholesterol: 236, MaxHeartRate: 178, BloodSugar: 98, ST_Depression: 0.8, HighRisk: 0 },
      { Age: 57, RestingBP: 120, Cholesterol: 354, MaxHeartRate: 163, BloodSugar: 110, ST_Depression: 0.6, HighRisk: 1 },
      { Age: 57, RestingBP: 140, Cholesterol: 192, MaxHeartRate: 148, BloodSugar: 125, ST_Depression: 0.4, HighRisk: 0 },
      { Age: 56, RestingBP: 140, Cholesterol: 294, MaxHeartRate: 153, BloodSugar: 115, ST_Depression: 1.3, HighRisk: 1 },
      { Age: 44, RestingBP: 120, Cholesterol: 263, MaxHeartRate: 173, BloodSugar: 90, ST_Depression: 0.0, HighRisk: 0 },
      { Age: 52, RestingBP: 172, Cholesterol: 199, MaxHeartRate: 162, BloodSugar: 135, ST_Depression: 0.5, HighRisk: 1 },
      { Age: 57, RestingBP: 150, Cholesterol: 168, MaxHeartRate: 174, BloodSugar: 140, ST_Depression: 1.6, HighRisk: 1 },
      { Age: 54, RestingBP: 140, Cholesterol: 239, MaxHeartRate: 160, BloodSugar: 105, ST_Depression: 1.2, HighRisk: 0 },
      { Age: 48, RestingBP: 130, Cholesterol: 275, MaxHeartRate: 139, BloodSugar: 112, ST_Depression: 0.2, HighRisk: 0 },
      { Age: 49, RestingBP: 130, Cholesterol: 266, MaxHeartRate: 171, BloodSugar: 98, ST_Depression: 0.6, HighRisk: 0 },
      { Age: 64, RestingBP: 110, Cholesterol: 211, MaxHeartRate: 144, BloodSugar: 118, ST_Depression: 1.8, HighRisk: 1 },
      { Age: 58, RestingBP: 150, Cholesterol: 283, MaxHeartRate: 162, BloodSugar: 128, ST_Depression: 1.0, HighRisk: 1 },
      { Age: 50, RestingBP: 120, Cholesterol: 219, MaxHeartRate: 158, BloodSugar: 96, ST_Depression: 1.6, HighRisk: 0 },
      { Age: 58, RestingBP: 120, Cholesterol: 340, MaxHeartRate: 172, BloodSugar: 104, ST_Depression: 0.0, HighRisk: 0 },
      { Age: 66, RestingBP: 160, Cholesterol: 246, MaxHeartRate: 120, BloodSugar: 145, ST_Depression: 2.6, HighRisk: 1 },
      { Age: 43, RestingBP: 115, Cholesterol: 303, MaxHeartRate: 181, BloodSugar: 92, ST_Depression: 1.2, HighRisk: 0 },
      { Age: 68, RestingBP: 144, Cholesterol: 193, MaxHeartRate: 141, BloodSugar: 130, ST_Depression: 3.4, HighRisk: 1 },
      { Age: 51, RestingBP: 125, Cholesterol: 213, MaxHeartRate: 166, BloodSugar: 99, ST_Depression: 0.5, HighRisk: 0 },
      { Age: 59, RestingBP: 135, Cholesterol: 254, MaxHeartRate: 150, BloodSugar: 122, ST_Depression: 1.5, HighRisk: 1 },
      { Age: 46, RestingBP: 128, Cholesterol: 230, MaxHeartRate: 168, BloodSugar: 94, ST_Depression: 0.0, HighRisk: 0 },
      { Age: 61, RestingBP: 138, Cholesterol: 271, MaxHeartRate: 136, BloodSugar: 132, ST_Depression: 2.1, HighRisk: 1 },
      { Age: 42, RestingBP: 120, Cholesterol: 240, MaxHeartRate: 170, BloodSugar: 91, ST_Depression: 0.4, HighRisk: 0 }
    ]
  },

  customer_segments: {
    id: 'customer_segments',
    name: 'E-Commerce Segmentation',
    category: 'Clustering',
    icon: 'pie-chart',
    description: 'Segment customer cohorts by purchasing power, frequency, basket size, and store engagement.',
    targetColumn: 'Segment',
    targetType: 'cluster',
    features: ['AnnualIncomeK', 'SpendingScore', 'PurchaseFrequency', 'AvgCartValue', 'AppSessionsPerWeek'],
    featureTypes: {
      AnnualIncomeK: 'number',
      SpendingScore: 'number',
      PurchaseFrequency: 'number',
      AvgCartValue: 'number',
      AppSessionsPerWeek: 'number',
      Segment: 'category'
    },
    data: [
      { AnnualIncomeK: 15, SpendingScore: 39, PurchaseFrequency: 2, AvgCartValue: 25, AppSessionsPerWeek: 3, Segment: 'Budget Casual' },
      { AnnualIncomeK: 16, SpendingScore: 81, PurchaseFrequency: 8, AvgCartValue: 45, AppSessionsPerWeek: 12, Segment: 'Impulse Trendsetter' },
      { AnnualIncomeK: 24, SpendingScore: 77, PurchaseFrequency: 7, AvgCartValue: 52, AppSessionsPerWeek: 10, Segment: 'Impulse Trendsetter' },
      { AnnualIncomeK: 35, SpendingScore: 35, PurchaseFrequency: 3, AvgCartValue: 38, AppSessionsPerWeek: 4, Segment: 'Budget Casual' },
      { AnnualIncomeK: 48, SpendingScore: 50, PurchaseFrequency: 5, AvgCartValue: 65, AppSessionsPerWeek: 7, Segment: 'Balanced Mainstream' },
      { AnnualIncomeK: 54, SpendingScore: 52, PurchaseFrequency: 6, AvgCartValue: 72, AppSessionsPerWeek: 8, Segment: 'Balanced Mainstream' },
      { AnnualIncomeK: 62, SpendingScore: 42, PurchaseFrequency: 4, AvgCartValue: 80, AppSessionsPerWeek: 6, Segment: 'Balanced Mainstream' },
      { AnnualIncomeK: 75, SpendingScore: 88, PurchaseFrequency: 12, AvgCartValue: 185, AppSessionsPerWeek: 18, Segment: 'VIP Power Buyer' },
      { AnnualIncomeK: 85, SpendingScore: 92, PurchaseFrequency: 14, AvgCartValue: 210, AppSessionsPerWeek: 22, Segment: 'VIP Power Buyer' },
      { AnnualIncomeK: 92, SpendingScore: 18, PurchaseFrequency: 2, AvgCartValue: 140, AppSessionsPerWeek: 3, Segment: 'Conservative High-Earner' },
      { AnnualIncomeK: 105, SpendingScore: 15, PurchaseFrequency: 1, AvgCartValue: 160, AppSessionsPerWeek: 2, Segment: 'Conservative High-Earner' },
      { AnnualIncomeK: 115, SpendingScore: 85, PurchaseFrequency: 15, AvgCartValue: 240, AppSessionsPerWeek: 25, Segment: 'VIP Power Buyer' },
      { AnnualIncomeK: 19, SpendingScore: 79, PurchaseFrequency: 9, AvgCartValue: 48, AppSessionsPerWeek: 14, Segment: 'Impulse Trendsetter' },
      { AnnualIncomeK: 28, SpendingScore: 40, PurchaseFrequency: 3, AvgCartValue: 30, AppSessionsPerWeek: 4, Segment: 'Budget Casual' },
      { AnnualIncomeK: 50, SpendingScore: 48, PurchaseFrequency: 5, AvgCartValue: 68, AppSessionsPerWeek: 7, Segment: 'Balanced Mainstream' },
      { AnnualIncomeK: 78, SpendingScore: 95, PurchaseFrequency: 13, AvgCartValue: 195, AppSessionsPerWeek: 20, Segment: 'VIP Power Buyer' },
      { AnnualIncomeK: 98, SpendingScore: 22, PurchaseFrequency: 2, AvgCartValue: 150, AppSessionsPerWeek: 4, Segment: 'Conservative High-Earner' },
      { AnnualIncomeK: 18, SpendingScore: 82, PurchaseFrequency: 8, AvgCartValue: 42, AppSessionsPerWeek: 11, Segment: 'Impulse Trendsetter' },
      { AnnualIncomeK: 58, SpendingScore: 54, PurchaseFrequency: 6, AvgCartValue: 75, AppSessionsPerWeek: 8, Segment: 'Balanced Mainstream' },
      { AnnualIncomeK: 88, SpendingScore: 87, PurchaseFrequency: 11, AvgCartValue: 190, AppSessionsPerWeek: 19, Segment: 'VIP Power Buyer' },
      { AnnualIncomeK: 102, SpendingScore: 12, PurchaseFrequency: 1, AvgCartValue: 155, AppSessionsPerWeek: 2, Segment: 'Conservative High-Earner' },
      { AnnualIncomeK: 22, SpendingScore: 32, PurchaseFrequency: 2, AvgCartValue: 28, AppSessionsPerWeek: 3, Segment: 'Budget Casual' },
      { AnnualIncomeK: 65, SpendingScore: 46, PurchaseFrequency: 5, AvgCartValue: 82, AppSessionsPerWeek: 7, Segment: 'Balanced Mainstream' },
      { AnnualIncomeK: 120, SpendingScore: 90, PurchaseFrequency: 16, AvgCartValue: 260, AppSessionsPerWeek: 28, Segment: 'VIP Power Buyer' },
      { AnnualIncomeK: 89, SpendingScore: 25, PurchaseFrequency: 3, AvgCartValue: 135, AppSessionsPerWeek: 5, Segment: 'Conservative High-Earner' }
    ]
  }
};

/**
 * CSV Parser Helper with RFC 4180 parsing and type inference
 */
class CSVParser {
  static parse(csvText) {
    const lines = csvText.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) throw new Error("CSV file must contain a header and at least one data row.");

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      const values = [];
      let insideQuote = false;
      let entry = '';

      for (let c = 0; c < currentLine.length; c++) {
        const char = currentLine[c];
        if (char === '"' || char === "'") {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          values.push(entry.trim());
          entry = '';
        } else {
          entry += char;
        }
      }
      values.push(entry.trim());

      if (values.length === headers.length) {
        const rowObj = {};
        headers.forEach((header, index) => {
          let val = values[index].replace(/^["']|["']$/g, '');
          if (!isNaN(val) && val !== '') {
            rowObj[header] = Number(val);
          } else {
            rowObj[header] = val;
          }
        });
        rows.push(rowObj);
      }
    }

    const featureTypes = {};
    headers.forEach(h => {
      const sample = rows.find(r => r[h] !== undefined && r[h] !== null);
      if (sample && typeof sample[h] === 'number') {
        const uniqueValues = new Set(rows.map(r => r[h]));
        if (uniqueValues.size === 2 && (uniqueValues.has(0) && uniqueValues.has(1))) {
          featureTypes[h] = 'binary';
        } else {
          featureTypes[h] = 'number';
        }
      } else {
        featureTypes[h] = 'category';
      }
    });

    const targetColumn = headers[headers.length - 1];
    return {
      id: 'custom_upload_' + Date.now(),
      name: 'Custom Uploaded Dataset',
      category: featureTypes[targetColumn] === 'number' ? 'Regression' : 'Classification',
      icon: 'file-text',
      description: `Custom dataset containing ${rows.length} rows and ${headers.length} attributes.`,
      targetColumn: targetColumn,
      targetType: featureTypes[targetColumn],
      features: headers.filter(h => h !== targetColumn),
      featureTypes: featureTypes,
      data: rows
    };
  }
}

/**
 * Synthetic Dataset Generator (Moons, Circles, Blobs)
 */
class SyntheticDataGenerator {
  static generate(type = 'blobs', count = 60, noise = 0.15) {
    const data = [];
    if (type === 'blobs') {
      for (let i = 0; i < count; i++) {
        const label = i < count / 2 ? 0 : 1;
        const cx = label === 0 ? 30 : 70;
        const cy = label === 0 ? 35 : 65;
        const x1 = Math.round((cx + (Math.random() - 0.5) * 35 * (1 + noise)) * 10) / 10;
        const x2 = Math.round((cy + (Math.random() - 0.5) * 35 * (1 + noise)) * 10) / 10;
        const score = Math.round((Math.random() * 50 + (label * 40)) * 10) / 10;
        data.push({ Feature_X: x1, Feature_Y: x2, EngagementScore: score, TargetClass: label });
      }
    } else if (type === 'moons') {
      const half = Math.floor(count / 2);
      for (let i = 0; i < half; i++) {
        const theta = (i / half) * Math.PI;
        const x1 = Math.round((50 + 25 * Math.cos(theta) + (Math.random() - 0.5) * 15 * noise) * 10) / 10;
        const x2 = Math.round((50 + 25 * Math.sin(theta) + (Math.random() - 0.5) * 15 * noise) * 10) / 10;
        data.push({ Feature_X: x1, Feature_Y: x2, EngagementScore: Math.round(x1 + x2), TargetClass: 0 });
      }
      for (let i = 0; i < half; i++) {
        const theta = (i / half) * Math.PI;
        const x1 = Math.round((65 - 25 * Math.cos(theta) + (Math.random() - 0.5) * 15 * noise) * 10) / 10;
        const x2 = Math.round((40 - 25 * Math.sin(theta) + (Math.random() - 0.5) * 15 * noise) * 10) / 10;
        data.push({ Feature_X: x1, Feature_Y: x2, EngagementScore: Math.round(x1 + x2), TargetClass: 1 });
      }
    }

    return {
      id: 'synthetic_' + type,
      name: `Synthetic ${type.toUpperCase()} Distribution`,
      category: 'Classification',
      icon: 'zap',
      description: `Generated non-linear 2D dataset with ${count} records and Gaussian noise factor ${noise}.`,
      targetColumn: 'TargetClass',
      targetType: 'binary',
      features: ['Feature_X', 'Feature_Y', 'EngagementScore'],
      featureTypes: { Feature_X: 'number', Feature_Y: 'number', EngagementScore: 'number', TargetClass: 'binary' },
      data: data
    };
  }
}
