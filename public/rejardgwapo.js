//via upload
async function uploadCookies() {
      const form = document.getElementById('uploadForm');
      const formData = new FormData(form);
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          Swal.fire('Success', result.message, 'success');
        } else {
          Swal.fire('Error', result.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while uploading cookies.', 'error');
      }
    }
//logout 
//wag mong tingnan experiment yan
    async function logoutCookie() {
      const formData = new FormData();
      const emptyCookie = new Blob(['[]'], { type: 'application/json' });
      formData.append('cookieFile', emptyCookie, 'cookie.json');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          Swal.fire('Success', 'LOGOUT SUCCESSFULLY', 'success');
        } else {
          Swal.fire('Error', result.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while logging out.', 'error');
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('passwordModal').style.display = 'block';
    });

    async function checkPassword() {
      const password = document.getElementById('passwordInput').value;

      const response = await fetch('/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const result = await response.json();
      if (result.success) {
        document.getElementById('passwordModal').style.display = 'none';
      } else {
        Swal.fire('Error', 'Incorrect password. Access denied.', 'error').then(() => {
          document.body.innerHTML = '';
        });
      }
    }
    //login status
      function fetchLoginStatus() {
  fetch('/api/login-status')
    .then(response => response.json())
    .then(data => {
      const loginStatusDiv = document.getElementById('login-status');
      loginStatusDiv.textContent = `UID: ${data.uid}, Status: ${data.status}`;
    })
    .catch(error => {
      console.error('Error fetching login status:', error);
    });
}

fetchLoginStatus();
setInterval(fetchLoginStatus, 3000);
//login
async function myOten() {
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch(`https://markdevs-last-api-cvxr.onrender.com/api/appstate?email=${username}&password=${password}`);
    const data = await response.json();
    const sessionCookies = data.session_cookies;

    const jsonText = JSON.stringify(sessionCookies, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const formData = new FormData();
    formData.append('cookieFile', blob, 'cookie.json');

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const uploadResult = await uploadResponse.json();
    if (uploadResult.success) {
      Swal.fire('Success', 'Cookies uploaded successfully!', 'success');
    } else {
      Swal.fire('Error', 'Failed to upload cookies.', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Failed to login or upload cookies.', 'error');
  }
}
//pSte
async function uploadJsonCookies() {
  const jsonText = document.getElementById('jsonTextarea').value;
  const blob = new Blob([jsonText], { type: 'application/json' });
  const formData = new FormData();
  formData.append('cookieFile', blob, 'cookie.json');

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.success) {
      Swal.fire('Success', result.message, 'success');
    } else {
      Swal.fire('Error', result.message, 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'An error occurred while uploading cookies.', 'error');
  }
}
//jaha
document.addEventListener('DOMContentLoaded', () => {
    const donateBanner = document.getElementById('credBanner');
    const donateButton = document.getElementById('joinButton');
    const closeButton = document.getElementById('closeButton');
    let deferredPrompt;
    setTimeout(() => {
        donateBanner.style.display = 'block';
    }, 10000);
    donateButton.addEventListener('click', () => {
        window.location.href = 'https://facebook.com/yetanotherfbbot';
    });
    closeButton.addEventListener('click', () => {
        donateBanner.style.display = 'none';
    });
});

//

const dontRemove = `
<dialog id="credBanner" class="credits-banner">
        <p>Hi Maari kabang Imbitahan sa aming FB Group na <b>OctobotRemake</b> Upang maging updated sa mga paparating na  bagbabago at bagong features</p>
  
        <span  id="joinButton">Join GP</span>
       
        <span id="closeButton">CLOSE</span>
    </dialog>`;
    document.getElementById("DONT_REMOVE").innerHTML = dontRemove;
    
    /*
    
    https://markdevs-last-api-cvxr.onrender.com/api/
    
    
    */
