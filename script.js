document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('input[type="start"]').value = "Jaipur";
  
    document.querySelector('button').addEventListener('click', function() {
        const destination = document.querySelector('input[type="end"]').value;
        fetchPrices(destination);
    });
  });
  
  
  function fetchPrices(destination) {
    fetch(`http://localhost:3000/prices/${destination}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                displayPrices(destination, data); 
            } else {
                alert('No prices found for the destination'); 
            }
        })
        .catch(error => {
            console.error('Error fetching prices:', error);
            alert('Error fetching prices. Please try again later.');
        });
  }
  
  function displayPrices(destination, prices) {
    // alert("Prices for", destination, "\n");
    prices.forEach(prices => {
        alert(`Car Price: Rs.${prices.car}\nBus Price: Rs.${prices.bus}\nFlight Price: Rs.${prices.flight}\nTrain Price: Rs.${prices.train}\n`);
    });
  }
