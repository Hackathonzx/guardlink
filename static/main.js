// scripts.js
document.getElementById('connectMetaMask').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask connected');
        } catch (error) {
            console.error('User rejected the request');
        }
    } else {
        alert('MetaMask is not installed');
    }
});

// document.getElementById('setupForm').addEventListener('submit', (event) => {
//     event.preventDefault();
//     const address = document.getElementById('delegateAddress').value;
//     const permissions = document.getElementById('permissions').value;
//     addDelegate(address, permissions);
// });

// function addDelegate(address, permissions) {
//     const delegateList = document.getElementById('delegateList');
//     const listItem = document.createElement('li');
//     listItem.textContent = `Address: ${address}, Permissions: ${permissions}`;
//     delegateList.appendChild(listItem);
// }

document.getElementById('startRecovery').addEventListener('click', () => {
    startRecoveryProcess();
});

function startRecoveryProcess() {
    const progressBar = document.getElementById('progress');
    const progressStatus = document.getElementById('progressStatus');
    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            progressStatus.textContent = 'Recovery Complete';
        } else {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressStatus.textContent = `Recovery Progress: ${progress}%`;
        }
    }, 1000);
}