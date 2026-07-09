User Model
{
  "_id": "65abc123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "password": "hashed_password",
  "phone": "08012345678",
  "role": "client",
  "profileImage": null,
  "isVerified": false,
  "createdAt": "2026-06-25",
  "updatedAt": "2026-06-25"
}


Booking Model
{
  "user": "65abc123",
  "serviceType": "Wedding Cinematography",
  "bookingDate": "2026-08-10",
  "location": "Port Harcourt",
  "description": "Full wedding coverage",
  "status": "pending",
  "amount": 250000,
  "paymentStatus": "unpaid"
}

Course Model
{
  "title": "Professional Cinematography Masterclass",
  "description": "Learn lighting, camera movement and storytelling",
  "price": 150000,
  "duration": "12 weeks",
  "level": "advanced",
  "isPublished": true
}

Course Registeration Model 
{
  "student": "userId",
  "course": "courseId",
  "status": "pending",
  "paymentStatus": "unpaid",
  "amountPaid": 150000
}

Vacancy Model
{
  "title": "Wedding Cinematographer",
  "description": "Need a professional wedding filmmaker",
  "category": "Videography",
  "location": "Port Harcourt",
  "budget": 250000,
  "status": "open"
}

Application Model
{
  "applicant": "userId",
  "vacancy": "vacancyId",
  "message": "I have 5 years experience in cinematography",
  "attachment": "cv-link.pdf",
  "status": "pending"
}

Review Model
{
"user":"userId",
"targetType":"course",
"targetId":"courseId",
"rating":5,
"comment":"Excellent cinematography training"
}

Advert Model
{
"title":"Wedding Video Package",
"description":"Professional wedding filming services",
"image":"cloudinary-url",
"type":"service",
"status":"active"
}

Media Model
{
"uploadedBy":"userId",
"url":"https://cloudinary.com/image.jpg",
"publicId":"cinema/profile123",
"mediaType":"image",
"category":"portfolio"
}

course document
{
  "_id": "665a8c91e5f7b21a9c123456",

  "uploadedBy": "665a8b12e5f7b21a9c987654",

  "url": "https://res.cloudinary.com/demo/image/upload/v1712345678/cinematography/profile/john-profile.jpg",

  "publicId": "cinematography/profile/john-profile",

  "mediaType": "image",

  "category": "profile",

  "filename": "john-profile.jpg",

  "createdAt": "2026-06-25T15:30:00.000Z",

  "updatedAt": "2026-06-25T15:30:00.000Z"
}

course video
{
  "_id": "665a8c91e5f7b21a9c555555",

  "uploadedBy": "665a8b12e5f7b21a9c987654",

  "url": "https://res.cloudinary.com/demo/video/upload/v1712345678/courses/cinematography-basics.mp4",

  "publicId": "courses/cinematography-basics",

  "mediaType": "video",

  "category": "course",

  "filename": "cinematography-basics.mp4",

  "createdAt": "2026-06-25T15:45:00.000Z",

  "updatedAt": "2026-06-25T15:45:00.000Z"
}

Payment Model
{
  "_id":"665a8c91e5f7b21a9c123456",

  "user":"665a8b12e5f7b21a9c987654",

  "purpose":"course",

  "referenceId":"courseId123",

  "paystackReference":"cinema_1712345678",

  "amount":500000,

  "status":"success",

  "createdAt":"2026-06-25T16:00:00.000Z"

}

Discount Model
{
  "_id":"665abc123",

  "createdBy":"adminId",

  "code":"WELCOME20",

  "type":"percentage",

  "value":20,

  "usageLimit":100,

  "usedCount":5,

  "expiresAt":"2026-12-31",

  "status":"active"

}
fixed discount
{
  "code":"SAVE5000",

  "type":"fixed",

  "value":5000
}

Content Model

Homepage Hero Heading
{
 "page":"homepage",

 "section":"hero",

 "key":"heading",

 "value":"Become a professional cinematographer",

 "type":"text"
}
Homepage Hero Description
{
 "page":"homepage",

 "section":"hero",

 "key":"description",

 "value":"Learn filmmaking from industry experts",

 "type":"textarea"
}
Course page title
{
 "page":"courses",

 "section":"header",

 "key":"title",

 "value":"Professional Cinematography Courses",

 "type":"text"
}
Footer copyright
{
 "page":"global",

 "section":"footer",

 "key":"copyright",

 "value":"© 2026 Cinematography Academy",

 "type":"text"
}

Content Model
{
 "page":"home",

 "sections":{

   "hero":{

     "title":"Learn Filmmaking",

     "description":"Become a filmmaker"

   },

   "about":{

     "title":"Who We Are"

   }

 }

}

Service Model
{
  "name": "Drone Service",
  "slug": "drone-service",
  "description": "Professional aerial cinematic coverage",
  "image": "cloudinary-url",
  "category": "production",
  "price": 100,
  "currency": "USD",
  "duration": "1 day",
  "isActive": true
}

Package Model
{
"name":"Gold Plan",

"slug":"gold-plan",

"services":[
"droneId",
"photoId",
"videoId"
],

"price":500,

"currency":"USD"
}

Bundle Model
{
  "name": "Professional Filmmaker Package",

  "slug": "professional-filmmaker-package",

  "description": "Complete filmmaking training bundle",

  "courses": [
    "cinematographyCourseId",
    "editingCourseId",
    "lightingCourseId"
  ],

  "price": 800,

  "currency": "USD"
}

Courses Module Structure
{
"title":"Professional Photography",

"modules":[

 {
  "title":"Camera Basics",

  "lessons":[

    {
     "title":"Understanding Exposure",
     "videoUrl":"..."
    }

  ]

 }

],

"learningOutcomes":[
 "Understand camera settings",
 "Master lighting"
]

}

Progress Model
{
 "student":"userId",

 "course":"courseId",

 "registration":"registrationId",

 "completedLessons":[
    "lessonId1",
    "lessonId2"
 ],

 "progressPercentage":50,

 "status":"in-progress"
}
Certificate Model
{
 "certificateNumber":"CERT-2026-0001",

 "student":"userId",

 "course":"courseId",

 "registration":"registrationId",

 "status":"valid",

 "issuedAt":"2026-06-27"
}

Single Booking
{
 "bookingType":"service",

 "service":"65abc",

 "amount":100000,

 "currency":"NGN"
}

Package Booking
{
 "bookingType":"package",

 "package":"89xyz",

 "amount":500000,

 "currency":"NGN"
}