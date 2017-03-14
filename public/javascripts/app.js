/* global Chart moment */

(function() {

  const types = ['statements', 'branches', 'functions', 'lines'];
  const colors = ['#0D94F6', '#49B04B', '#3D4DB7', '#d4e157'];

  const data = {
    labels: [],
    datasets: [],
  };

  types.forEach((type, index) => {
    data.datasets.push({
      label: type,
      fill: false,
      borderColor: colors[index],
      pointBorderColor: colors[index],
      data: [],
    });
  });

  window.branchData.forEach(item => {
    data.labels.push(moment(item.created_at).format('M/D HH:mm'));

    types.forEach((type, index) => {
      data.datasets[index].data.push(parseInt(JSON.parse(item.stats)[type]));
    });
  });

  const ctx = document.getElementById('chart');
  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {}
  });

})();
