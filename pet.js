// Pet Evolution Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result');
    
    calculateBtn.addEventListener('click', function() {
        const currentPet = document.getElementById('current-pet').value;
        const materialPet = document.getElementById('material-pet').value;
        const petType = document.getElementById('pet-type').value;
        
        let successRate = 0;
        let auraReward = 0;
        let resultPet = "None";
        
        // Calculate success rate based on rules
        if (petType === 'same') {
            successRate = 100;
        } else {
            successRate = 66;
        }
        
        // Determine aura reward and resulting pet
        if (currentPet === 'mythic') {
            auraReward = 50;
            resultPet = materialPet === 'mythic-ultimate' ? 'Mythic [Ultimate]' : 'Mythic [True]';
        } else if (currentPet === 'mythic-true') {
            auraReward = 100;
            resultPet = 'Mythic [Ultimate]';
        }
        
        // Update the UI with results
        document.getElementById('rate').textContent = successRate;
        document.getElementById('aura').textContent = auraReward;
        document.getElementById('result-pet').textContent = resultPet;
        
        // Show the result container
        resultContainer.style.display = 'block';
        
        // Color code the success rate
        const rateElement = document.getElementById('success-rate');
        if (successRate === 100) {
            rateElement.style.borderLeftColor = '#4CAF50';
        } else if (successRate >= 66) {
            rateElement.style.borderLeftColor = '#FFC107';
        } else {
            rateElement.style.borderLeftColor = '#F44336';
        }
    });
});