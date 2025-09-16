// translations
const translations = {
  en: {
    title: "STEM Schools Nearby",
    made: "made with ❤️ by ZIKO",
    address: "Address",
    distance: "Distance",
    driving: "Get driving distance",
    route: "Show Route",
    openMap: "Open in Google Maps",
    yourLoc: "Your Location",
    locate: "Locate me"
  },
  ar: {
    title: "مدارس المتفوقين القريبة",
    made: "معمول بحب ❤️ بواسطة ZIKO",
    address: "العنوان",
    distance: "المسافة",
    driving: "احسب مسافة السواقة",
    route: "اظهر الطريق",
    openMap: "افتح على خرائط جوجل",
    yourLoc: "موقعك",
    locate: "حدد موقعى"
  }
};
let currentLang='en';
function t(k){return translations[currentLang][k];}

// نفس الـschoolsData اللى فوق
// … ضع الـschoolsData كله هنا …

function toRadians(d){return d*Math.PI/180;}
function calculateDistance(lat1,lon1,lat2,lon2){
  const R=6371,dLat=toRadians(lat2-lat1),dLon=toRadians(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(toRadians(lat1))*Math.cos(toRadians(lat2))*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
async function fetchDrivingDistance(userLoc,school){
  const url=`https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${school.lng},${school.lat}?overview=false&alternatives=false&steps=false`;
  const res=await fetch(url);
  const json=await res.json();
  if(json.routes.length>0){return json.routes[0].distance/1000;}
  throw new Error('No route found');
}
function getUserLocation(){
  return new Promise((resolve,reject)=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude}),reject);
    }else reject();
  });
}

let routeLayer=null,userMarker=null;

async function renderSchools(){
  const list=document.getElementById('schools-list');
  schoolsData.forEach(s=>{
    s.distance=calculateDistance(window.userLoc.lat,window.userLoc.lng,s.lat,s.lng);
    s.gm_link=`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;
  });
  schoolsData.sort((a,b)=>a.distance-b.distance);
  list.innerHTML='';
  schoolsData.forEach((s,i)=>{
    L.marker([s.lat,s.lng]).addTo(window.map).bindPopup(`<b>${s.name}</b><br>${s.address}`);

    const card=document.createElement('div');
    card.className='school-item';
    card.innerHTML=`
      <h3>${s.name}</h3>
      <p>${t('address')}: ${s.address}</p>
      <p id="dist-${i}">${t('distance')}: ${s.distance.toFixed(2)} km</p>
      <a href="${s.gm_link}" target="_blank">${t('openMap')}</a><br>
      <button class="btn" id="drive-${i}"><i class="fa-solid fa-car"></i> ${t('driving')}</button>
      <button class="btn" id="route-${i}"><i class="fa-solid fa-route"></i> ${t('route')}</button>
    `;
    list.appendChild(card);

    document.getElementById(`drive-${i}`).addEventListener('click',async()=>{
      const el=document.getElementById(`dist-${i}`);
      el.innerHTML='<div style="background:#007bff;color:#fff;padding:6px;border-radius:4px;display:inline-block;">…</div>';
      try{
        const km=await fetchDrivingDistance(window.userLoc,s);
        el.innerHTML=`<div style="background:#007bff;color:#fff;padding:6px;border-radius:4px;display:inline-block;">${t('distance')}: ${km.toFixed(2)} km (driving)</div>`;
      }catch{
        el.innerHTML=`<div style="background:#007bff;color:#fff;padding:6px;border-radius:4px;display:inline-block;">${t('distance')}: ${s.distance.toFixed(2)} km</div>`;
      }
    });

    document.getElementById(`route-${i}`).addEventListener('click',async()=>{
      if(routeLayer){window.map.removeLayer(routeLayer);routeLayer=null;}
      try{
        const res=await fetch(`https://router.project-osrm.org/route/v1/driving/${window.userLoc.lng},${window.userLoc.lat};${s.lng},${s.lat}?overview=full&geometries=geojson`);
        const json=await res.json();
        if(json.routes.length>0){
          const coords=json.routes[0].geometry.coordinates.map(c=>[c[1],c[0]]);
          routeLayer=L.polyline(coords,{color:'blue',weight:4}).addTo(window.map);
          window.map.fitBounds(L.latLngBounds(coords),{padding:[50,50]});
        }
      }catch(e){
        alert(currentLang==='ar'?'تعذر رسم الطريق':'Could not draw route');
      }
    });
  });
}

async function init(){
  document.getElementById('title').textContent=t('title');
  document.getElementById('madeby').textContent=t('made');
  document.getElementById('locate-text').textContent=t('locate');
  document.body.setAttribute('dir',currentLang==='ar'?'rtl':'ltr');
  try{window.userLoc=await getUserLocation();}catch{window.userLoc={lat:30.0444,lng:31.2357};}
  window.map=L.map('map').setView([window.userLoc.lat,window.userLoc.lng],7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(window.map);
  userMarker=L.marker([window.userLoc.lat,window.userLoc.lng]).addTo(window.map).bindPopup(t('yourLoc')).openPopup();
  renderSchools();
}

document.getElementById('locate-btn').addEventListener('click',async()=>{
  try{
    window.userLoc=await getUserLocation();
    userMarker.setLatLng([window.userLoc.lat,window.userLoc.lng]);
    window.map.setView([window.userLoc.lat,window.userLoc.lng],12);
  }catch{alert('تعذر تحديد موقعك');}
});
document.getElementById('lang-select').addEventListener('change',e=>{currentLang=e.target.value;window.map.remove();init();});
init();
