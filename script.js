(async function getNotFollowingBack() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Obtener headers de autenticación desde las cookies y storage
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const ds_user_id = getCookie('ds_user_id');
  const csrf_token = getCookie('csrftoken');

  if (!ds_user_id) {
    console.error('No se pudo detectar el ID de usuario. Asegurate de haber iniciado sesión.');
    return;
  }

  const headers = {
    'x-csrftoken': csrf_token,
    'x-ig-app-id': '936619743392459',
    'x-requested-with': 'XMLHttpRequest'
  };

  async function fetchList(endpoint) {
    let list = [];
    let maxId = '';
    let hasMore = true;

    console.log(`Recolectando ${endpoint}...`);

    while (hasMore) {
      const url = `https://www.instagram.com/api/v1/friendships/${ds_user_id}/${endpoint}/?count=100${maxId ? `&max_id=${maxId}` : ''}`;
      
      try {
        const response = await fetch(url, { headers });
        if (response.status === 429) {
          console.warn('Límite de peticiones alcanzado. Esperando 30 segundos...');
          await delay(30000);
          continue;
        }

        const data = await response.json();
        
        if (data.users) {
          list = list.concat(data.users.map(u => ({ username: u.username, name: u.full_name })));
        }

        if (data.next_max_id) {
          maxId = data.next_max_id;
          // Pausa preventiva de 1.5s para no disparar rate limits
          await delay(1500);
        } else {
          hasMore = false;
        }
      } catch (err) {
        console.error(`Error al obtener ${endpoint}:`, err);
        hasMore = false;
      }
    }
    return list;
  }

  try {
    const followers = await fetchList('followers');
    const following = await fetchList('following');

    const followerUsernames = new Set(followers.map(u => u.username));
    const notFollowingBack = following.filter(u => !followerUsernames.has(u.username));

    console.clear();
    console.log(`%cTotal que seguís: ${following.length}`, 'font-weight: bold;');
    console.log(`%cTotal que te siguen: ${followers.length}`, 'font-weight: bold;');
    console.log(`%cNo te siguen de vuelta (${notFollowingBack.length}):`, 'color: #ff4757; font-weight: bold; font-size: 14px;');
    
    console.table(notFollowingBack);

    // Opcional: genera un array de solo los nombres de usuario
    window.unfollowersList = notFollowingBack.map(u => u.username);
    console.log('Podés acceder a la lista en la variable "unfollowersList"');

  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
})();