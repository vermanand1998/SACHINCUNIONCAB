// import all images from assets/images directory
// import img01 from "../all-images/cars-img/crysta final.png";
// import img02 from "../all-images/cars-img/etios final.png";
// import img03 from "../all-images/cars-img/dezire final.png";
// import img04 from "../all-images/cars-img/nissan-offer.png";
// import img05 from "../all-images/cars-img/offer-toyota.png";
// import img06 from "../all-images/cars-img/mercedes-offer.png";
// import img07 from "../all-images/cars-img/toyota-offer-2.png";
// import img08 from "../all-images/cars-img/mercedes-offer.png";

import inovaFinalImage from "../all-images/cars-img/inovaFinalImage.png";
import inovaFinalCarSeats from "../all-images/cars-img/inovaFinalCarSeats.png";
import ToyotaEtiosFinal from "../all-images/cars-img/ToyotaEtiosFinal.png";
import toyotaEtiosFinalSeats from "../all-images/cars-img/toyotaEtiosFinalSeats.png";
import MarutiSuzukiDezireFinalImage from "../all-images/cars-img/MarutiSuzukiDezireFinalImage.png";
import MarutiSuzukiDezireSeats from "../all-images/cars-img/MarutiSuzukiDezireSeats.png";


const carData = [
  {
    id: 1,
    brand: "Toyota",
    rating: 112,
    carName: "Toyota Innova Crysta(6+1 Seater)",
    imgUrl: inovaFinalImage,
    imgUrlSeats:inovaFinalCarSeats,
    model: "Model 3",
    price: 200,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "8 Hours or 80 Km= ₹2500/-",
          "Extra Hours= ₹200/- Per Hour",
          "Night Charges= ₹300/-",
          "Airport Pickup or Drop Charges= ₹2000/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [  
          "12 Hours or 250 Km(min) = ₹4500/-",
          "Extra Km @ ₹18/- Per Km",
          "Extra Hours ₹200/- Per Hour",
          "Night Charges Rs. 300/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "Fixed Charges For First 2000Km = ₹65,000/-",
          "Charges After Exceeding Limit of 2000 Km @ ₹17/- Per Km",
          "Night Halt @ ₹250/- Per Night(Applicable from 10:00pm to 6:00am)",
          "**Per Day Working Hour Garage to Garage will be 12 Hours**",
          "**Toll Tax/Parking as applicable**",
          "**5% GST will applicable as per the GST rule**",
        ],
      },
    ],
    description:
      "The Toyota Innova Crysta stands out as one of the most beloved Multi-Utility Vehicles (MUVs) among customers. Revel in the complete luxury package it offers, featuring a centralized AC for a refreshing journey and impeccably clean interiors and exteriors. The comfortable seats add an extra layer of joy to your travels. Book your ride now and indulge in the epitome of style, comfort, and elegance with the Toyota Innova Crysta.",
  },

  {
    id: 2,
    brand: "Toyota",
    rating: 102,
    carName: "Toyota Etios(4+1 Seater)",
    imgUrl: ToyotaEtiosFinal,
    imgUrlSeats:toyotaEtiosFinalSeats,
    model: "Model-2022",
    price: 120,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "8 Hours or 80 Km= ₹1800/-",
          "Extra Hours= ₹120/- Per Hour",
          "Night Charges= ₹250/-",
          "Airport Pickup or Drop Charges= ₹1300/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "12 Hours or 200 Km(min) = ₹2200/-",
          "Extra Km @ ₹11/- Per Km",
          "Extra Hours ₹120/- Per Hour",
          "Night Charges Rs. 250/-",,
        ],
      },
    ],
    monthly: [
      {
        key1: [
         "Fixed Charges For First 2000Km = ₹38,000/-",
          "Charges After Exceeding Limit of 2000 Km @ ₹11/- Per Km",
          "Night Halt @ ₹200/- Per Night(Applicable from 10:00pm to 6:00am)",
          "**Per Day Working Hour Garage to Garage will be 12 Hours**",
          "**Toll Tax/Parking as applicable**",
          "**5% GST will applicable as per the GST rule**",
        ],
      },
    ],
    description:
      "Experience comfort and style with the Toyota Etios, a spacious 4+1 seater designed for your convenience. Whether it's a family trip or a business outing, the Etios ensures a smooth and enjoyable ride. Reserve your Etios today to embark on a journey of comfort and reliability. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Don't miss out on the opportunity to make your upcoming travel memorable with the Toyota Etios.",
  },

  {
    id: 3,
    brand: "Maruti Suzuki",
    rating: 132,
    carName: "Maruti Suzuki Dezire(4+1 Seater)",
    imgUrl: MarutiSuzukiDezireFinalImage,
    imgUrlSeats:toyotaEtiosFinalSeats,
    model: "Model-2022",
    price: 125,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "8 Hours or 80 Km= ₹1800/-",
          "Extra Hours= ₹120/- Per Hour",
          "Night Charges= ₹250/-",
          "Airport Pickup or Drop Charges= ₹1300/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "12 Hours or 200 Km(min) = ₹2200/-",
          "Extra Km @ ₹11/- Per Km",
          "Extra Hours ₹120/- Per Hour",
          "Night Charges Rs. 250/-",,
        ],
      },
    ],
    monthly: [
      {
        key1: [
         "Fixed Charges For First 2000Km = ₹38,000/-",
          "Charges After Exceeding Limit of 2000 Km @ ₹11/- Per Km",
          "Night Halt @ ₹200/- Per Night(Applicable from 10:00pm to 6:00am)",
          "**Per Day Working Hour Garage to Garage will be 12 Hours**",
          "**Toll Tax/Parking as applicable**",
          "**5% GST will applicable as per the GST rule**",
        ],
      },
    ],
    description:
      "Designed for small groups, the Maruti Suzuki Dzire effortlessly accommodates four passengers, offering an ideal blend of style and functionality. Its sleek design and cutting-edge features promise a delightful driving experience. Choose the Dzire for a journey where comfort meets sophistication, and every drive becomes a pleasure.",
  }
];

export default carData;
