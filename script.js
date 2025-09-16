const translations = {
  en: {
    title: "STEM Schools Nearby",
    made: "made with ❤️ by ZIKO",
    address: "Address",
    distance: "Distance",
    driving: "🚗 Get driving distance",
    route: "🛣️ Show Route",
    openMap: "🌍 Open in Google Maps",
    yourLoc: "Your Location",
    locate: "📍 Locate me"
  },
  ar: {
    title: "مدارس المتفوقين القريبة",
    made: "معمول بحب ❤️ بواسطة ZIKO",
    address: "العنوان",
    distance: "المسافة",
    driving: "🚗 احسب مسافة السواقة",
    route: "🛣️ اظهر الطريق",
    openMap: "🌍 افتح على خرائط جوجل",
    yourLoc: "موقعك",
    locate: "📍 حدد موقعى"
  }
};
let currentLang='en';
function t(k){return translations[currentLang][k];}

// كل المدارس
const schoolsData = [
  {name:"STEM High School – Maadi",address:"X876+FH9, Maadi as Sarayat Al Gharbeyah, Tura, Cairo Governorate 4064145",lat:29.963685859495783,lng:31.311470067023386},
  {name:"STEM High School – Nasr City",address:"2CHG+4RM, Nasr City, Cairo Governorate 4731130",lat:30.02886071407647,lng:31.426460323294073},
  {name:"STEM High School for Boys – 6th of October",address:"W3MF+64 October Gardens, First 6th of October, Giza Governorate 3283010",lat:29.93308155892515,lng:31.07267764983385},
  {name:"STEM High School – Al Wegieh (6th of October)",address:"Al Wegieh Center, 6th of October City, Giza Governorate",lat:29.961936869971872,lng:30.902121195858626},
  {name:"STEM High School – Borg El Arab (Alexandria)",address:"VH9P+HMM, Hod Sakrah WA Abu Hamad, Borg El Arab, Alexandria Governorate 5221250",lat:30.86896617451884,lng:29.5866984535659},
  {name:"STEM High School – Luxor (Red Sea)",address:"PQP6+WFC, Tieba City Unnamed Road, Red Sea Governorate, Luxor City, Luxor",lat:25.736938426710903,lng:32.76149701843059},
  {name:"STEM High School – Dakahlia",address:"CGPC+C43, International Coastal Rd, Al Hafir WA Al Amal, Belqas, Dakahlia Governorate 7730203",lat:31.436032328342286,lng:31.520290395918593},
  {name:"STEM High School – Al-Sharqia (Zagazig)",address:"HGP9+XMW, Harayah Raznah, Zagazig, Al-Sharqia Governorate 7124105",lat:30.58748543870247,lng:31.519180038213037},
  {name:"STEM High School – Kafr El-Sheikh",address:"El Drayeb Street, Qism Kafr El-Shaikh, Kafr Al Sheikh First, Kafr El-Sheikh Governorate 6860581",lat:31.11382951817345,lng:30.954409026587758},
  {name:"STEM High School – Sers El Laian (Menofia)",address:"CXV5+8HH, Madinet SERS Al Layanah, Sers El Laian City, Menofia Governorate 6060084",lat:30.44331327472523,lng:30.959007953548515},
  {name:"STEM High School – Sadat City (Menofia)",address:"9GJW+PM, Sadat City, Menofia Governorate 6011521",lat:30.3818088747554,lng:30.546622009369415},
  {name:"STEM High School – Ismailia",address:"Security Forces Complex, Educational Complex, Ismailia Desert Rd, 41511",lat:30.62618167463584,lng:32.22689992472066},
  {name:"STEM High School – Obour",address:"Obour, Al-Qalyubia Governorate 6360191",lat:30.2263347584288,lng:31.44888811490449},
  {name:"STEM High School – Faiyum",address:"Behind New Social Housing Buildings, Al Faiyum Al Gadida City, Faiyum Governorate",lat:29.21625487535105,lng:30.868401953499752},
  {name:"STEM High School – Assiut",address:"53PF+4XP, Assiut El Wady El Gedid Road, Al Bourah, Asyut, Assiut Governorate",lat:27.184882189095735,lng:31.074990066917273},
  {name:"STEM High School – New Minya",address:"4V87+7RQ, Al Zahir Al Sahrawi, New Minya, Minya Governorate",lat:28.115702075950917,lng:30.864623995787007},
  {name:"STEM High School – Beni Suef",address:"Unnamed Road, Third Neighborhood, Beni Suef New City, Beni Suef Governorate",lat:29.02065431190559,lng:31.099411524656915},
  {name:"STEM High School – Hurghada (Red Sea)",address:"7PQJ+XCR, Mubarak 11, Street of STEM School, Hurghada 2, Red Sea Governorate, Egypt",lat:27.290545241784063,lng:33.73113602459167},
  {name:"STEM High School – Sohag",address:"CMV8+4GG, Sohag Al Gadida City, Sohag Governorate, Egypt",lat:26.442810283308162,lng:31.66632969572585},
  {name:"STEM High School – Qena",address:"Unnamed Road, New Qena City, Qena Governorate, Egypt",lat:26.244772222719977,lng:32.74068399571885},
  {name:"STEM High School – Tanta (Gharbia)",address:"Q2C8+MQJ, Kafr Abou Dawoud, Tanta, Gharbia Governorate, Egypt",lat:30.771719174565504,lng:31.016861338220636}
];

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
      <button class="btn" id="drive-${i}">${t('driving')}</button>
      <button class="btn" id="route-${i}">${t('route')}</button>
    `;
    list.appendChild(card);

    document.getElementById(`drive-${i}`).addEventListener('click',async()=>{
      const el=document.getElementById(`dist-${i}`);
      el.textContent='…';
      try{
        const km=await fetchDrivingDistance(window.userLoc,s);
        el.textContent=`${t('distance')}: ${km.toFixed(2)} km (driving)`;
      }catch{
        el.textContent=`${t('distance')}: ${s.distance.toFixed(2)} km`;
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
  }catch{alert(currentLang==='ar'?'تعذر تحديد موقعك':'Could not get location');}
});
document.getElementById('lang-select').addEventListener('change',e=>{currentLang=e.target.value;window.map.remove();init();});
init();
