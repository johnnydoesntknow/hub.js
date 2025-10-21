// DELETE THIS FILE BEFORE LAUNCH - Mock data for development

export const getMockRepPoints = () => {
  return {
    total: 1250,
    change: '+150 this month',
  };
};

export const getMockOPNBalance = () => {
  return {
    balance: '5,432.50',
    usdValue: '$2,716.25',
  };
};

export const getMockBadges = () => {
  return [
    { id: 1, name: 'Originator', image: '/badges/ORIGINATOR - FINAL V1.png' },
    { id: 2, name: 'Server OG', image: '/badges/SERVER OG - FINAL V1.png' },
    { id: 3, name: 'Signal Runner', image: '/badges/SIGNAL RUNNER - FINAL V1.png' },
  ];
};

export const getMockNFTs = () => {
  return [
    { id: 1, name: 'Digital Durham #42', image: '/nfts/nft1.png' },
    { id: 2, name: 'Digital Durham #103', image: '/nfts/nft2.png' },
  ];
};

export const getMockGraphData = () => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: '$OPN',
        data: [2500, 3200, 2800, 4100, 3900, 5432],
        borderColor: '#4105b6',
        backgroundColor: 'rgba(65, 5, 182, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
};