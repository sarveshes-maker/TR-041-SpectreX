export const LABS = [
  {"place": "Cuddalore", "lat": 11.7480, "lng": 79.7644, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Sugarcane Research Station Campus, Semandalam, Cuddalore – 607 001"},
  {"place": "Kanchipuram", "lat": 12.8342, "lng": 79.7036, "address": "Senior Agricultural Officer, STL, Panchupettai, Kanchipuram -631 502"},
  {"place": "Vellore", "lat": 12.9165, "lng": 79.1325, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Gudiyatham TK, Melalathu 638 806, Vellore Dt"},
  {"place": "Dharmapuri", "lat": 12.1384, "lng": 78.1584, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Taluk office Compound, Dharmapuri – 638 702"},
  {"place": "Salem", "lat": 11.6643, "lng": 78.1460, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 35/37, B 11 Cross Rajaram Nagar, Near vaniyakala kalyana mandapam, Salem – 636 007"},
  {"place": "Coimbatore", "lat": 11.0168, "lng": 76.9558, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Lawley Road, GCT (Post), Coimbatore – 642 013"},
  {"place": "Pudukkottai", "lat": 10.3844, "lng": 78.8202, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Kudumianmalai – 622104, Pudukottai Dt."},
  {"place": "Erode", "lat": 11.3410, "lng": 77.7172, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 41/74 Pongundranar Street, Karungalpalayam, Erode – 638 003"},
  {"place": "Trichy", "lat": 10.7905, "lng": 78.7047, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Kajamalai, Trichy – 620 020"},
  {"place": "Madurai", "lat": 9.9252, "lng": 78.1198, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 52/North cithirai Street, Madurai -625 001"},
  {"place": "Aduthurai", "lat": 11.0101, "lng": 79.4800, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Aduthurai – 612101, Thanjavur Dt."},
  {"place": "Theni", "lat": 10.0104, "lng": 77.4768, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 136/2, Second street, Sadayal Nagar, Bangalamedu (south side), Theni – 625 531, Theni Dt"},
  {"place": "Dindigul", "lat": 10.3673, "lng": 77.9806, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 3, Co-operative colony, Dindigul – 624 001"},
  {"place": "Sivagangai", "lat": 9.8433, "lng": 78.4809, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Office of the Asst.Director of Agriculture Complex, (TNSTC Branch – Near), Thondi Road, Sivagangai – 630 561"},
  {"place": "Paramakudi", "lat": 9.5463, "lng": 78.5862, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Paramakudi – 623 707, Ramanathapuram Dt."},
  {"place": "Thirunelveli", "lat": 8.7139, "lng": 77.7567, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Flat No.37, Sankar colony, Playankottai, Thirunelveli -2"},
  {"place": "Thoothukudi", "lat": 8.8100, "lng": 78.1400, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Sathur Road, Kovilpatty – 628 501, Thoothukudi Dt."},
  {"place": "Nagarkoil", "lat": 8.1833, "lng": 77.4119, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 20c, Sundarajan compound, Esaki Amman Kovil street, Nagarkoil – 629 001"},
  {"place": "Ooty", "lat": 11.4100, "lng": 76.6900, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Ooty – 643 001"},
  {"place": "Namakkal", "lat": 11.2189, "lng": 78.1672, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 142 –H, Kishore complex, (HDFC Bank opp), Salem Main Road, Namakkal – 637 001"},
  {"place": "Thiruvarur", "lat": 10.7661, "lng": 79.6344, "address": "Regulated market complex, ADA office upstair, Thiruvarur – 610 001"},
  {"place": "Thiruvallur", "lat": 13.1322, "lng": 79.9120, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Kakkalur, Thiruvallur to Avadi Road, Thiruvallur – 602 003"},
  {"place": "Perambalur", "lat": 11.2333, "lng": 78.8833, "address": "Senior Agricultural Officer, Soil Testing Laboratory, 93F/21A Venkatajalapathi Nagar, Near New Bus Station, Perambalur – 621 210"},
  {"place": "Krishnagiri", "lat": 12.5186, "lng": 78.2137, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Office of the Assistant Director of Agriculture, Near Ragupathy Hospital, Krishnagiri – 635 001"},
  {"place": "Virudunagar", "lat": 9.5872, "lng": 77.9514, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Near Joint Director of Agriculture office, Collectorate Complex Virudunagar – 626 001"},
  {"place": "Karur", "lat": 10.9601, "lng": 78.0766, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Thillai nagar, Rajnoor, Thanthoni, Karur – 639 003"},
  {"place": "Ariyalur", "lat": 11.1401, "lng": 79.0786, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Valajanagaram, Ariyalur – 621 704"},
  {"place": "Nagapattinam", "lat": 10.7672, "lng": 79.8444, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Panchayathu union Complex, Nagapattinam – 611 001"},
  {"place": "Villupuram", "lat": 11.9401, "lng": 79.4861, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Joint Director of Agriculture office, Collectorate Master plan complex, Villupuram – 605 602"},
  {"place": "Thiruvannamalai", "lat": 12.2257, "lng": 79.0747, "address": "Senior Agricultural Officer, Soil Testing Laboratory, Kottam Playam Road, Venkikal, Thiruvannamalai – 606 604"}
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const findNearestLab = (userLat, userLng) => {
  if (!userLat || !userLng) return null;
  
  let nearest = null;
  let minDistance = Infinity;

  LABS.forEach(lab => {
    const dist = getDistance(userLat, userLng, lab.lat, lab.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...lab, distance: dist.toFixed(1) };
    }
  });

  return nearest;
};
