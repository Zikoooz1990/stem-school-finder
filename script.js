const schoolsData = [
  {name_ar:"مدرسة المتفوقين – المعادي (بنات)", name_en:"STEM High School – Maadi (Girls)", gender:"girls", lat:29.963685859495783, lng:31.311470067023386, address_ar:"المعادى، القاهرة", address_en:"Maadi, Cairo"},
  {name_ar:"مدرسة المتفوقين – القاهرة الجديدة (مشتركة)", name_en:"STEM High School – New Cairo (Mixed)", gender:"mixed", lat:30.02886071407647, lng:31.426460323294073, address_ar:"القاهرة الجديدة", address_en:"New Cairo"},
  {name_ar:"مدرسة المتفوقين – حدائق أكتوبر (بنين)", name_en:"STEM High School – 6th October (Boys)", gender:"boys", lat:29.93308155892515, lng:31.07267764983385, address_ar:"حدائق أكتوبر", address_en:"6th of October"},
  {name_ar:"مدرسة المتفوقين – 6 أكتوبر الحي 11 (مشتركة)", name_en:"STEM High School – Al Wegieh (Mixed)", gender:"mixed", lat:29.961936869971872, lng:30.902121195858626, address_ar:"السادس من أكتوبر", address_en:"6th of October"},
  {name_ar:"مدرسة المتفوقين – برج العرب (مشتركة)", name_en:"STEM High School – Borg El Arab (Mixed)", gender:"mixed", lat:30.86896617451884, lng:29.5866984535659, address_ar:"برج العرب", address_en:"Borg El Arab"},
  {name_ar:"مدرسة المتفوقين – طيبة الجديدة (مشتركة)", name_en:"STEM High School – Luxor (Mixed)", gender:"mixed", lat:25.736938426710903, lng:32.76149701843059, address_ar:"الأقصر", address_en:"Luxor"},
  {name_ar:"مدرسة المتفوقين – جمصة (مشتركة)", name_en:"STEM High School – Dakahlia (Mixed)", gender:"mixed", lat:31.436032328342286, lng:31.520290395918593, address_ar:"الدقهلية", address_en:"Dakahlia"},
  {name_ar:"مدرسة المتفوقين – الزقازيق (مشتركة)", name_en:"STEM High School – Al-Sharqia (Mixed)", gender:"mixed", lat:30.58748543870247, lng:31.519180038213037, address_ar:"الشرقية", address_en:"Al-Sharqia"},
  {name_ar:"مدرسة المتفوقين – كفر الشيخ (مشتركة)", name_en:"STEM High School – Kafr El-Sheikh (Mixed)", gender:"mixed", lat:31.11382951817345, lng:30.954409026587758, address_ar:"كفر الشيخ", address_en:"Kafr El-Sheikh"},
  {name_ar:"مدرسة المتفوقين – سرس الليان (بنات)", name_en:"STEM High School – Sers El Laian (Girls)", gender:"girls", lat:30.44331327472523, lng:30.959007953548515, address_ar:"سرس الليان", address_en:"Sers El Laian"},
  {name_ar:"مدرسة المتفوقين – مدينة السادات (بنين)", name_en:"STEM High School – Sadat City (Boys)", gender:"boys", lat:30.3818088747554, lng:30.546622009369415, address_ar:"مدينة السادات", address_en:"Sadat City"},
  {name_ar:"مدرسة المتفوقين – الإسماعيلية (مشتركة)", name_en:"STEM High School – Ismailia (Mixed)", gender:"mixed", lat:30.62618167463584, lng:32.22689992472066, address_ar:"الإسماعيلية", address_en:"Ismailia"},
  {name_ar:"مدرسة المتفوقين – العبور (مشتركة)", name_en:"STEM High School – Obour (Mixed)", gender:"mixed", lat:30.2263347584288, lng:31.44888811490449, address_ar:"العبور", address_en:"Obour"},
  {name_ar:"مدرسة المتفوقين – الفيوم الجديدة (بنين)", name_en:"STEM High School – Faiyum (Boys)", gender:"boys", lat:29.21625487535105, lng:30.868401953499752, address_ar:"الفيوم الجديدة", address_en:"Faiyum"},
  {name_ar:"مدرسة المتفوقين – أسيوط الجديدة (مشتركة)", name_en:"STEM High School – Assiut (Mixed)", gender:"mixed", lat:27.184882189095735, lng:31.074990066917273, address_ar:"أسيوط", address_en:"Assiut"},
  {name_ar:"مدرسة المتفوقين – المنيا الجديدة (بنين)", name_en:"STEM High School – New Minya (Boys)", gender:"boys", lat:28.115702075950917, lng:30.864623995787007, address_ar:"المنيا الجديدة", address_en:"New Minya"},
  {name_ar:"مدرسة المتفوقين – بني سويف الجديدة (مشتركة)", name_en:"STEM High School – Beni Suef (Mixed)", gender:"mixed", lat:29.02065431190559, lng:31.099411524656915, address_ar:"بني سويف", address_en:"Beni Suef"},
  {name_ar:"مدرسة المتفوقين – الغردقة (مشتركة)", name_en:"STEM High School – Hurghada (Mixed)", gender:"mixed", lat:27.290545241784063, lng:33.73113602459167, address_ar:"الغردقة", address_en:"Hurghada"},
  {name_ar:"مدرسة المتفوقين – سوهاج الجديدة (بنات)", name_en:"STEM High School – Sohag (Girls)", gender:"girls", lat:26.442810283308162, lng:31.66632969572585, address_ar:"سوهاج", address_en:"Sohag"},
  {name_ar:"مدرسة المتفوقين – قنا الجديدة (مشتركة)", name_en:"STEM High School – Qena (Mixed)", gender:"mixed", lat:26.244772222719977, lng:32.74068399571885, address_ar:"قنا الجديدة", address_en:"Qena"},
  {name_ar:"مدرسة المتفوقين – طنطا (مشتركة)", name_en:"STEM High School – Tanta (Mixed)", gender:"mixed", lat:30.771719174565504, lng:31.016861338220636, address_ar:"طنطا", address_en:"Tanta"}
];

let map,userMarker,userLoc={lat:30.0444,lng:31.2357},currentLang='en';

function haversine(lat1,lon1,lat2,lon2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

async function drivingDistance(u,s){
  const url=`https://router.project-osrm.org/route/v1/driving/${u.lng},${u.lat};${s.lng},${s.lat}?overview=false`;
  const res=await fetch(url);
  const json=await res.json();
  return json.routes[0].distance/1000;
}

function filteredSchools(){
  const val=document.getElementById('gender-filter').value;
  return schoolsData.filter(s=>{
    if(val==='all')return true;
    if(val==='boys')return s.gender==='boys'||s.gender==='mixed';
    if(val==='girls')return s.gender==='girls'||s.gender==='mixed';
  });
}

function renderSchools(){
  document.getElementById('schools-list').innerHTML='';
  filteredSchools().map(s=>{
    s.distance=haversine(userLoc.lat,userLoc.lng,s.lat,s.lng);
    s.gm=`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;
    return s;
  }).sort((a,b)=>a.distance-b.distance).forEach((s,i)=>{
    L.marker([s.lat,s.lng]).addTo(map).bindPopup(`<b>${currentLang==='ar'?s.name_ar:s.name_en}</b><br>${currentLang==='ar'?s.address_ar:s.address_en}`);
    const div=document.createElement('div');
    div.className='school-item';
    div.innerHTML=`
      <h3>${currentLang==='ar'?s.name_ar:s.name_en}</h3>
      <p>${currentLang==='ar'?s.address_ar:s.address_en}</p>
      <p id="dist-${i}">📏 ${s.distance.toFixed(1)} km</p>
      <p>
        <a href="${s.gm}" target="_blank">🌍 Maps</a>
        <button id="drive-${i}">🚗</button>
        <button id="route-${i}">🗺️</button>
      </p>`;
    document.getElementById('schools-list').appendChild(div);
    document.getElementById(`drive-${i}`).addEventListener('click',async()=>{
      const el=document.getElementById(`dist-${i}`);el.textContent='⏳...';
      try{
        const d=await drivingDistance(userLoc,s);
        el.textContent=`🚗 ${d.toFixed(1)} km — 📏 ${s.distance.toFixed(1)} km`;
      }catch(e){el.textContent=`📏 ${s.distance.toFixed(1)} km`;}
    });
    document.getElementById(`route-${i}`).addEventListener('click',()=>{
      map.setView([s.lat,s.lng],10);
      if(L.Routing){
        L.Routing.control({waypoints:[L.latLng(userLoc.lat,userLoc.lng),L.latLng(s.lat,s.lng)],routeWhileDragging:false}).addTo(map);
      } else {
        window.open(s.gm,'_blank');
      }
    });
  });
}

async function updateUserLocation(){
  try{
    const pos=await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(p=>res(p),e=>rej(e)));
    userLoc={lat:pos.coords.latitude,lng:pos.coords.longitude};
    userMarker.setLatLng([userLoc.lat,userLoc.lng]).bindPopup('📍').openPopup();
    renderSchools();
  }catch(e){console.warn(e);}
}

window.addEventListener('DOMContentLoaded',async()=>{
  try{
    const pos=await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(p=>res(p),e=>rej(e)));
    userLoc={lat:pos.coords.latitude,lng:pos.coords.longitude};
  }catch(e){console.warn('Using Cairo center');}
  map=L.map('map').setView([userLoc.lat,userLoc.lng],7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap'}).addTo(map);
  userMarker=L.marker([userLoc.lat,userLoc.lng]).addTo(map).bindPopup('📍').openPopup();
  document.getElementById('gender-filter').addEventListener('change',renderSchools);
  document.getElementById('locate-btn').addEventListener('click',updateUserLocation);
  document.getElementById('lang-switch').addEventListener('click',()=>{
    currentLang=currentLang==='en'?'ar':'en';
    renderSchools();
  });
  renderSchools();
});
