// === Egypt STEM Schools Data ===
const schoolsData = [
  {name:"STEM High School – Maadi",address:"X876+FH9, Maadi as Sarayat Al Gharbeyah, Tura, Cairo Governorate 4064145",lat:29.963685859495783,lng:31.311470067023386},
  {name:"STEM High School – Nasr City",address:"2CHG+4RM, Nasr City, Cairo Governorate 4731130",lat:30.02886071407647,lng:31.426460323294073},
  {name:"STEM High School for Boys – 6th of October",address:"W3MF+64 October Gardens, First 6th of October, Giza Governorate 3283010",lat:29.93308155892515,lng:31.07267764983385},
  {name:"STEM High School – Al Wegieh (6th of October)",address:"Al Wegieh Center, 6th of October City, Giza Governorate",lat:29.961936869971872,lng:30.902121195858626},
  {name:"STEM High School – Borg El Arab (Alexandria)",address:"VH9P+HMM, Hod Sakrah WA Abu Hamad, Borg El Arab, Alexandria Governorate 5221250",lat:30.86896617451884,lng:29.5866984535659},
  {name:"STEM High School – Luxor (Red Sea)",address:"PQP6+WFC, Tieba City Unnamed Road, Red Sea Governorate, Luxor City, Luxor",lat:25.736938426710903,lng:32.76149701843059},
  {name:"STEM High School – Dakahlia",address:"CGPC+C43, International Coastal Rd, Al Hafir WA Al Amal, Belqas, Dakahlia Governorate 7730203",lat:31.436032328342286,lng:31.520290395918593},
  {name:"STEM High School – Al-Sharqia (Zagazig)",address:"HGP9+XMW, Harayah Raznah, Zagazig, Al-Sharqia Governorate 7124105",lat:30.58748543870247,lng:31.519180038213037},
  {name:"STEM High School – Kafr El-Sheikh",address:"el drayeb street, Qism Kafr El-Shaikh, Kafr Al Sheikh First, Kafr El-Sheikh Governorate 6860581",lat:31.11382951817345,lng:30.954409026587758},
  {name:"STEM High School – Sers El Laian (Menofia)",address:"CXV5+8HH, Madinet SERS Al Layanah, Sers El Layan City, Menofia Governorate 6060084",lat:30.44331327472523,lng:30.959007953548515},
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

async function init(){
  const schoolsListDiv=document.getElementById("schools-list");
  let userLocation={lat:30.0444,lng:31.2357};
  try{userLocation=await getUserLocation();}catch(err){
    schoolsListDiv.innerHTML="<p style='text-align:center;color:#888'>Couldn't get your location. Showing straight-line distances from Cairo center. Click \"Get driving distance\" for driving.</p>";
  }

  const map=L.map('map').setView([userLocation.lat,userLocation.lng],7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  L.marker([userLocation.lat,userLocation.lng]).addTo(map).bindPopup("Your Location").openPopup();

  schoolsData.forEach(s=>{
    s.distance=calculateDistance(userLocation.lat,userLocation.lng,s.lat,s.lng);
    s.gm_link=`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;
  });
  schoolsData.sort((a,b)=>(a.distance||Infinity)-(b.distance||Infinity));
  schoolsListDiv.innerHTML='';
  schoolsData.forEach((s,idx)=>{
    L.marker([s.lat,s.lng]).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.address}`);
    const card=document.createElement('div');
    card.className='school-item';
    const distText=isFinite(s.distance)?`${s.distance.toFixed(2)} km (straight-line)`:'Distance unknown';
    card.innerHTML=`
      <h3>${s.name}</h3>
      <p><i class="fa-solid fa-location-dot"></i> ${s.address}</p>
      <p id="dist-${idx}"><i class="fa-solid fa-road"></i> ${distText}</p>
      <a href="${s.gm_link}" target="_blank"><i class="fa-solid fa-map-location-dot"></i> Open in Google Maps</a>
      <button id="drive-btn-${idx}"><i class="fa-solid fa-car"></i> Get driving distance</button>`;
    schoolsListDiv.appendChild(card);
    document.getElementById(`drive-btn-${idx}`).addEventListener('click',async()=>{
      const distEl=document.getElementById(`dist-${idx}`);
      distEl.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> calculating driving distance...';
      try{
        const driveKm=await fetchDrivingDistance(userLocation,s);
        distEl.innerHTML=`<i class="fa-solid fa-car"></i> ${driveKm.toFixed(2)} km (driving) — ${s.distance.toFixed(2)} km (straight-line)`;
      }catch(err){
        distEl.innerHTML=`<i class="fa-solid fa-road"></i> ${s.distance.toFixed(2)} km (straight-line) — driving distance unavailable`;
      }
    });
  });
}
init();

