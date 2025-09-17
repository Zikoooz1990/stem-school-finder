// ==================== بيانات المدارس ====================
const schoolsData = [
  {name:"STEM High School – Maadi (Girls)",gender:"girls",address:"X876+FH9, Maadi as Sarayat Al Gharbeyah, Tura, Cairo Governorate",lat:29.963685859495783,lng:31.311470067023386},
  {name:"STEM High School – New Cairo (Mixed)",gender:"mixed",address:"2CHG+4RM, Nasr City, Cairo Governorate",lat:30.02886071407647,lng:31.426460323294073},
  {name:"STEM High School – 6th October (Boys)",gender:"boys",address:"W3MF+64 October Gardens, Giza Governorate",lat:29.93308155892515,lng:31.07267764983385},
  {name:"STEM High School – Al Wegieh (Mixed)",gender:"mixed",address:"Al Wegieh Center, 6th of October City, Giza Governorate",lat:29.961936869971872,lng:30.902121195858626},
  {name:"STEM High School – Borg El Arab (Mixed)",gender:"mixed",address:"VH9P+HMM, Borg El Arab, Alexandria Governorate",lat:30.86896617451884,lng:29.5866984535659},
  {name:"STEM High School – Luxor (Mixed)",gender:"mixed",address:"PQP6+WFC, Tieba City, Luxor",lat:25.736938426710903,lng:32.76149701843059},
  {name:"STEM High School – Dakahlia (Mixed)",gender:"mixed",address:"CGPC+C43, Belqas, Dakahlia Governorate",lat:31.436032328342286,lng:31.520290395918593},
  {name:"STEM High School – Al-Sharqia (Mixed)",gender:"mixed",address:"HGP9+XMW, Zagazig, Al-Sharqia Governorate",lat:30.58748543870247,lng:31.519180038213037},
  {name:"STEM High School – Kafr El-Sheikh (Mixed)",gender:"mixed",address:"el drayeb street, Kafr El-Sheikh",lat:31.11382951817345,lng:30.954409026587758},
  {name:"STEM High School – Sers El Laian (Girls)",gender:"girls",address:"CXV5+8HH, Sers El Laian City, Menofia",lat:30.44331327472523,lng:30.959007953548515},
  {name:"STEM High School – Sadat City (Boys)",gender:"boys",address:"9GJW+PM, Sadat City, Menofia",lat:30.3818088747554,lng:30.546622009369415},
  {name:"STEM High School – Ismailia (Mixed)",gender:"mixed",address:"Security Forces Complex, Ismailia Desert Rd",lat:30.62618167463584,lng:32.22689992472066},
  {name:"STEM High School – Obour (Mixed)",gender:"mixed",address:"Obour, Al-Qalyubia",lat:30.2263347584288,lng:31.44888811490449},
  {name:"STEM High School – Faiyum (Boys)",gender:"boys",address:"Al Faiyum Al Gadida City, Faiyum Governorate",lat:29.21625487535105,lng:30.868401953499752},
  {name:"STEM High School – Assiut (Mixed)",gender:"mixed",address:"Assiut El Wady El Gedid Road, Asyut",lat:27.184882189095735,lng:31.074990066917273},
  {name:"STEM High School – New Minya (Boys)",gender:"boys",address:"New Minya, Minya Governorate",lat:28.115702075950917,lng:30.864623995787007},
  {name:"STEM High School – Beni Suef (Mixed)",gender:"mixed",address:"Third Neighborhood, Beni Suef New City",lat:29.02065431190559,lng:31.099411524656915},
  {name:"STEM High School – Hurghada (Mixed)",gender:"mixed",address:"7PQJ+XCR, Mubarak 11, Hurghada",lat:27.290545241784063,lng:33.73113602459167},
  {name:"STEM High School – Sohag (Girls)",gender:"girls",address:"CMV8+4GG, Sohag Al Gadida City",lat:26.442810283308162,lng:31.66632969572585},
  {name:"STEM High School – Qena (Mixed)",gender:"mixed",address:"New Qena City, Qena Governorate",lat:26.244772222719977,lng:32.74068399571885},
  {name:"STEM High School – Tanta (Mixed)",gender:"mixed",address:"Q2C8+MQJ, Tanta, Gharbia Governorate",lat:30.771719174565504,lng:31.016861338220636}
];

let map,userMarker;
let userLoc={lat:30.0444,lng:31.2357};

// حساب المسافة المستقيمة
function haversine(lat1,lon1,lat2,lon2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// جلب مسافة السواقة
async function drivingDistance(u,school){
  const url=`https://router.project-osrm.org/route/v1/driving/${u.lng},${u.lat};${school.lng},${school.lat}?overview=false`;
  const res=await fetch(url);
  const json=await res.json();
  return json.routes[0].distance/1000;
}

// فلترة المدارس حسب النوع
function getFilteredSchools(){
  const filter=document.getElementById('gender-filter').value;
  return schoolsData.filter(s=>{
    if(filter==='all')return true;
    if(filter==='boys')return s.gender==='boys'||s.gender==='mixed';
    if(filter==='girls')return s.gender==='girls'||s.gender==='mixed';
  });
}

// رسم المدارس
function renderSchools(){
  const list=document.getElementById('schools-list');
  list.innerHTML='';
  const filtered=getFilteredSchools();
  filtered.forEach((s,i)=>{
    s.distance=haversine(userLoc.lat,userLoc.lng,s.lat,s.lng);
    s.gm=`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;
  });
  filtered.sort((a,b)=>a.distance-b.distance);

  filtered.forEach((s,i)=>{
    L.marker([s.lat,s.lng]).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.address}`);
    const div=document.createElement('div');
    div.className='school-item';
    div.innerHTML=`
      <h3>${s.name}</h3>
      <p>${s.address}</p>
      <p id="dist-${i}">📏 ${s.distance.toFixed(1)} km (straight)</p>
      <p>
        <a href="${s.gm}" target="_blank">🌍 Google Maps</a>
        <button id="drive-${i}">🚗 Driving</button>
        <button id="route-${i}">🗺️ Show Route</button>
      </p>`;
    list.appendChild(div);

    document.getElementById(`drive-${i}`).addEventListener('click',async()=>{
      const el=document.getElementById(`dist-${i}`);
      el.textContent='⏳ calculating...';
      try{
        const d=await drivingDistance(userLoc,s);
        el.textContent=`🚗 ${d.toFixed(1)} km (driving) — 📏 ${s.distance.toFixed(1)} km straight`;
      }catch(e){el.textContent=`📏 ${s.distance.toFixed(1)} km (straight)`;}
    });
    document.getElementById(`route-${i}`).addEventListener('click',()=>{
      map.setView([s.lat,s.lng],10);
      L.Routing.control({
        waypoints:[L.latLng(userLoc.lat,userLoc.lng),L.latLng(s.lat,s.lng)],
        routeWhileDragging:false
      }).addTo(map);
    });
  });
}

// تحديث موقع المستخدم
async function updateUserLocation(){
  try{
    const pos=await new Promise((res,rej)=>{
      navigator.geolocation.getCurrentPosition(p=>res(p),e=>rej(e));
    });
    userLoc={lat:pos.coords.latitude,lng:pos.coords.longitude};
    userMarker.setLatLng([userLoc.lat,userLoc.lng]).bindPopup('📍 موقعك').openPopup();
    renderSchools();
  }catch(e){console.warn(e);}
}

// بدء
window.addEventListener('DOMContentLoaded',async()=>{
  // جلب موقع المستخدم أول مرة
  try{
    const pos=await new Promise((res,rej)=>{
      navigator.geolocation.getCurrentPosition(p=>res(p),e=>rej(e));
    });
    userLoc={lat:pos.coords.latitude,lng:pos.coords.longitude};
  }catch(e){console.warn('Using Cairo center');}
  // إنشاء الماب مرة واحدة
  map=L.map('map').setView([userLoc.lat,userLoc.lng],7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap'}).addTo(map);
  userMarker=L.marker([userLoc.lat,userLoc.lng]).addTo(map).bindPopup('📍 موقعك').openPopup();

  // فلتر النوع
  document.getElementById('gender-filter').addEventListener('change',renderSchools);
  // زرار تحديد الموقع
  document.getElementById('locate-btn').addEventListener('click',updateUserLocation);

  renderSchools();
});
