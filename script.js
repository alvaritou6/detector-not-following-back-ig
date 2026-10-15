(async function verificarNoSeguidoresV2() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const userId = getCookie('ds_user_id');
  const csrfToken = getCookie('csrftoken');

  if (!userId) {
    console.error('❌ No se pudo detectar tu userId. Asegúrate de estar logueado en instagram.com');
    return;
  }

  // Encabezados obligatorios que exige Instagram actualmente para devolver datos
  const headers = {
    'X-IG-App-ID': '936619743392459', // ID público oficial de la Web App de Instagram
    'X-ASBD-ID': '129477',
    'X-CSRFToken': csrfToken || '',
    'X-Requested-With': 'XMLHttpRequest'
  };

  async function obtenerListaV1(tipo, etiqueta) {
    let usuarios = [];
    let maxId = null;
    let tieneMas = true;

    console.log(`⏳ Obteniendo lista de ${etiqueta}...`);

    while (tieneMas) {
      const url = `https://www.instagram.com/api/v1/friendships/${userId}/${tipo}/?count=50${maxId ? `&max_id=${maxId}` : ''}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status} al consultar ${etiqueta}.`);
      }

      const data = await res.json();

      if (!data.users) {
        console.warn('⚠️ Respuesta inesperada de la API:', data);
        break;
      }

      data.users.forEach((u) => {
        usuarios.push({
          username: u.username,
          full_name: u.full_name,
          es_verificado: u.is_verified,
          es_privado: u.is_private,
          perfil: `https://www.instagram.com/${u.username}/`
        });
      });

      console.log(`   ↳ ${usuarios.length} cuentas procesadas (${etiqueta})...`);

      if (data.next_max_id) {
        maxId = data.next_max_id;
        // Pausa aleatoria entre 1.5s y 2.5s para cuidar la cuenta
        await sleep(1500 + Math.random() * 1000);
      } else {
        tieneMas = false;
      }
    }

    return usuarios;
  }

  try {
    console.log('🚀 Iniciando análisis con API v1. No cierres ni recargues la pestaña...');

    const seguidores = await obtenerListaV1('followers', 'Seguidores');
    const seguidos = await obtenerListaV1('following', 'Seguidos');

    const setSeguidores = new Set(seguidores.map((u) => u.username));
    const noMeSiguen = seguidos.filter((u) => !setSeguidores.has(u.username));

    console.log(`✅ ¡Análisis terminado!`);
    console.log(`📊 Sigues a: ${seguidos.length} | Te siguen: ${seguidores.length}`);
    console.log(`🚨 Cuentas que NO te siguen de vuelta (${noMeSiguen.length}):`);

    console.table(noMeSiguen);

    // Guardamos el resultado en una variable global por si quieres filtrarlo después
    window.noMeSiguenList = noMeSiguen;
    console.log('💡 Tip: Puedes escribir "window.noMeSiguenList" en la consola para acceder a los datos crudos.');

  } catch (err) {
    console.error('❌ Error durante la ejecución:', err.message);
  }
})();