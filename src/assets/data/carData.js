// import all images from assets/images directory
import img01 from "../all-images/cars-img/nissan-offer.png";
import img02 from "../all-images/cars-img/offer-toyota.png";
import img03 from "../all-images/cars-img/bmw-offer.png";
import img04 from "../all-images/cars-img/nissan-offer.png";
import img05 from "../all-images/cars-img/offer-toyota.png";
import img06 from "../all-images/cars-img/mercedes-offer.png";
import img07 from "../all-images/cars-img/toyota-offer-2.png";
import img08 from "../all-images/cars-img/mercedes-offer.png";

const carData = [
  {
    id: 1,
    brand: "Toyota",
    rating: 112,
    carName: "Toyota Innova Crysta(6+1 Seater)",
    imgUrl: img01,
    model: "Model 3",
    price: 44,
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
          "Fixed Charges For First 2000Km = ₹60,000/-",
          "Charges After Exceeding Limit of 2000 Km @ ₹17/- Per Km",
          "Night Halt @ ₹250/- Per Night(Applicable from 10:00pm to 6:00am)",
          "**Per Day Working Hour Garage to Garage will be 12 Hours**",
          "**Toll Tax/Parking as applicable**",
          "**5% GST will applicable as per the GST rule**",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 2,
    brand: "Toyota",
    rating: 102,
    carName: "Toyota Etios(4+1 Seater)",
    imgUrl: img02,
    model: "Model-2022",
    price: 123,
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
         "Fixed Charges For First 2000Km = ₹36,000/-",
          "Charges After Exceeding Limit of 2000 Km @ ₹11/- Per Km",
          "Night Halt @ ₹200/- Per Night(Applicable from 10:00pm to 6:00am)",
          "**Per Day Working Hour Garage to Garage will be 12 Hours**",
          "**Toll Tax/Parking as applicable**",
          "**5% GST will applicable as per the GST rule**",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 3,
    brand: "Maruti Suzuki",
    rating: 132,
    carName: "Maruti Suzuki Dezire",
    imgUrl: img03,
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
         "Fixed Charges For First 2000Km = ₹32,000/-",
          "Charges After Exceeding Limit of 2000 Km @ ₹11/- Per Km",
          "Night Halt @ ₹200/- Per Night(Applicable from 10:00pm to 6:00am)",
          "**Per Day Working Hour Garage to Garage will be 12 Hours**",
          "**Toll Tax/Parking as applicable**",
          "**5% GST will applicable as per the GST rule**",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 4,
    brand: "Nissan",
    rating: 100,
    carName: "Nissan Mercielago",
    imgUrl: img04,
    model: "Model-2022",
    price: 127,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 5,
    brand: "Ferrari",
    rating: 99,
    carName: "Ferrari Camry",
    imgUrl: img05,
    model: "Model-2022",
    price: 143,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 6,
    brand: "Mercedes",
    rating: 19,
    carName: "Mercedes Benz XC90",
    imgUrl: img06,
    model: "Model-2022",
    price: 1534,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 7,
    brand: "Audi",
    rating: 8,
    carName: "Audi Fiesta",
    imgUrl: img07,
    model: "Model 3",
    price: 165,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 8,
    brand: "Colorado",
    rating: 2,
    carName: "Rolls Royce Colorado",
    imgUrl: img08,
    model: "Model 3",
    price: 172,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 9,
    brand: "Tesla",
    rating: 112,
    carName: "Tesla Malibu",
    imgUrl: img01,
    model: "Model 3",
    price: 182,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 10,
    brand: "Toyota",
    rating: 102,
    carName: "Toyota Aventador",
    imgUrl: img02,
    model: "Model-2022",
    price: 145,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 11,
    brand: "BMW",
    rating: 132,
    carName: "BMW X3",
    imgUrl: img03,
    model: "Model-2022",
    price: 244,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 12,
    brand: "Nissan",
    rating: 102,
    carName: "Nissan Mercielago",
    imgUrl: img04,
    model: "Model-2022",
    price: 214,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 13,
    brand: "Ferrari",
    rating: 94,
    carName: "Ferrari Camry",
    imgUrl: img05,
    model: "Model-2022",
    price: 224,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 14,
    brand: "Mercedes",
    rating: 119,
    carName: "Mercedes Benz XC90",
    imgUrl: img06,
    model: "Model-2022",
    price: 223,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 15,
    brand: "Audi",
    rating: 82,
    carName: "Audi Fiesta",
    imgUrl: img07,
    model: "Model 3",
    price: 530,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  },

  {
    id: 16,
    brand: "Colorado",
    rating: 52,
    carName: "Rolls Royce Colorado",
    imgUrl: img08,
    model: "Model 3",
    price: 630,
    speed: "20kmpl",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    local: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    outStation: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    monthly: [
      {
        key1: [
          "2 Hours 40 KM Rs. 1100/-",
          "4 Hours 40 KM Rs. 1400/-",
          "8 Hours 80 KM Rs. 1800/-",
          "Extra Hours Rs. 100/- Per Hour",
          "Night Charges Rs. 200/-",
        ],
      },
    ],
    description:
      " Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam. Dolor labore lorem no accusam sit justo sadipscing labore invidunt voluptua, amet duo et gubergren vero gubergren dolor. At diam.",
  }
];

export default carData;
