// ترجمة
const translations = {
  en: {
    title: "STEM Schools Nearby",
    made: "made with ❤️ by ZIKO",
    address: "Address",
    distance: "Distance",
    driving: "Get driving distance",
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
    openMap: "افتح على خرائط جوجل",
    yourLoc: "موقعك",
    locate: "حدد موقعى"
  }
};

let currentLang = 'en';
function t(key){ return translations[currentLang][key] || key; }

// بيانات المدارس (نفس البيانات)
const schoolsData = [
  {name:"STEM High School – Maadi",address:"X876+FH9, Maadi as Sarayat Al Gharbeyah, Tura, Cairo Governorate 4064145",lat:29.963685859495783,lng:31.311470067023386},
  /* ... باقى المدارس ... */
  {name:"STEM High School – Tanta (Gharbia)",address:"Q2C8+MQJ, Kafr Abou Dawoud, Tanta, Gharbia Governorate, Egypt",lat:30.771719174565504,lng:31.016861338220636}
];

function toRadians(deg){return deg*Math.PI/180;}
function calculateDistance(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=toRadians(lat2-lat1);
  const dLon=toRadians(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(toRadians(lat1))*Math.cos(toRadians(lat2))*Math.sin(dLon/2)**2;
  const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return R*c;
}

async function fetchDrivingDistance(userLoc,school){
  const url=`https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${school.lng},${school.lat}?overview=false&alternatives=false&steps=false`;
  const res=await fetch(url);
  if(!res.ok)throw new Error('OSRM request failed');
  const json=await res.json();
  if(json&&json.routes&&json.routes.length>0){return json.routes[0].distance/1000;}
  throw new Error('No route found');
}

function getUserLocation(){
  return new Promise((resolve,reject)=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos=>resolve({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        err=>reject(err),
        {maximumAge:60000,timeout:10000});
    }else reject(new Error("Geolocation not supported"));
  });
}

let routeLayer=null;
let userMarker=null;

async function renderSchools(){
  const schoolsListDiv=document.getElementById("schools-list");
  schoolsData.forEach(s=>{
    s.distance=calculateDistance(window.userLoc.lat,window.userLoc.lng,s.lat,s.lng);
    s.gm_link=`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;
  });
  schoolsData.sort((a,b)=>(a.distance||Infinity)-(b.distance||Infinity));
  schoolsListDiv.innerHTML='';
  schoolsData.forEach((s,idx)=>{
    const marker=L.marker([s.lat,s.lng]).addTo(window.map)
      .bindPopup(`<b>${s.name}</b><br>${s.address}`);

    marker.on('click',async()=>{
      // امسح خط قديم
      if(routeLayer){window.map.removeLayer(routeLayer);routeLayer=null;}
      try{
        const res=await fetch(`https://router.project-osrm.org/route/v1/driving/${window.userLoc.lng},${window.userLoc.lat};${s.lng},${s.lat}?overview=full&geometries=geojson`);
        const json=await res.json();
        if(json.routes.length>0){
          const coords=json.routes[0].geometry.coordinates.map(c=>[c[1],c[0]]);
          routeLayer=L.polyline(coords,{color:'blue',weight:4}).addTo(window.map);
          const bounds=L.latLngBounds(coords);
          window.map.fitBounds(bounds,{padding:[50,50]});
        }
      }catch(err){console.warn(err);}
    });

    const card=document.createElement('div');
    card.className='school-item';
    const distText=isFinite(s.distance)?`${s.distance.toFixed(2)} km (straight-line)`:'Distance unknown';
    card.innerHTML=`
      <h3>${s.name}</h3>
      <p><i class="fa-solid fa-location-dot"></i> ${t('address')}: ${s.address}</p>
      <p id="dist-${idx}"><i class="fa-solid fa-road"></i> ${t('distance')}: ${distText}</p>
      <a href="${s.gm_link}" target="_blank"><i class="fa-solid fa-map-location-dot"></i> ${t('openMap')}</a>
      <button id="drive-btn-${idx}"><i class="fa-solid fa-car"></i> ${t('driving')}</button>`;
    schoolsListDiv.appendChild(card);
    document.getElementById(`drive-btn-${idx}`).addEventListener('click',async()=>{
      const distEl=document.getElementById(`dist-${idx}`);
      distEl.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> ...';
      try{
        const driveKm=await fetchDrivingDistance(window.userLoc,s);
        distEl.innerHTML=`<i class="fa-solid fa-car"></i> ${driveKm.toFixed(2)} km (driving) — ${s.distance.toFixed(2)} km (straight-line)`;
      }catch(err){
        distEl.innerHTML=`<i class="fa-solid fa-road"></i> ${s.distance.toFixed(2)} km (straight-line) — driving distance unavailable`;
      }
    });
  });
}

async function init(){
  document.getElementById('title').textContent=t('title');
  document.getElementById('madeby').textContent=t('made');
  document.getElementById('locate-text').textContent=t('locate');
  if(currentLang==='ar'){document.body.setAttribute('dir','rtl');}else{document.body.setAttribute('dir','ltr');}

  try{window.userLoc=await getUserLocation();}
  catch(err){window.userLoc={lat:30.0444,lng:31.2357};}

  window.map=L.map('map').setView([window.userLoc.lat,window.userLoc.lng],7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(window.map);

  userMarker=L.marker([window.userLoc.lat,window.userLoc.lng]).addTo(window.map).bindPopup(t('yourLoc')).openPopup();

  renderSchools();
}

// زرار تحديد الموقع
document.getElementById('locate-btn').addEventListener('click', async () => {
  try {
    window.userLoc = await getUserLocation();
    if(userMarker){
      userMarker.setLatLng([window.userLoc.lat,window.userLoc.lng]);
    } else {
      userMarker=L.marker([window.userLoc.lat,window.userLoc.lng]).addTo(window.map)
        .bindPopup(t('yourLoc')).openPopup();
    }
    window.map.setView([window.userLoc.lat,window.userLoc.lng],12);
  } catch(e) {
    alert(currentLang==='ar'?'تعذر تحديد موقعك':'Could not get your location');
  }
});

// تغيير اللغة
document.getElementById('lang-select').addEventListener('change',e=>{
  currentLang=e.target.value;
  if(window.map){window.map.remove();}
  init();
});

init();
