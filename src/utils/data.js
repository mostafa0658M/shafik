export const categories = [
  {
    name: "cars",
    image:
      "https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg",
  },
  {
    name: "games",
    image:
      "https://images.unsplash.com/photo-1652734935726-7afd52076e7f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8dmlkZW9nYW1lc3x8fHx8fDE2OTAzNzExOTM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=200",
  },
  {
    name: "wallpaper",
    image:
      "https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg",
  },
  {
    name: "websites",
    image:
      "https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg",
  },
  {
    name: "photo",
    image:
      "https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg",
  },
  {
    name: "food",
    image:
      "https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg",
  },
  {
    name: "nature",
    image:
      "https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg",
  },
  {
    name: "quotes",
    image:
      "https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg",
  },
  {
    name: "coding",
    image:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29kaW5nfHx8fHx8MTY5MDM3MTEwMQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=200",
  },
  {
    name: "pets",
    image:
      "https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg",
  },
  {
    name: "others",
    image:
      "https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg",
  },
];
export function userQuery(userId) {
  return `*[_type=="user" && _id == "${userId}"]`;
}
export function searchQuery(searchTerm) {
  return `*[_type == "pin"  && title match "${searchTerm}*" || category match "${searchTerm}*" || about match "${searchTerm}*"]{
    image {
      asset-> {
          url
      }
    },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
        _key,
        postedBy -> {
            _id,
            userName,
            image
        }
    },
  }`;
}
export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
    image {
        asset-> {
            url
        }
    },
      _id,
      destination,
      postedBy -> {
        _id,
        userName,
        image
      },
      save[] {
        _key,
        postedBy -> {
            _id,
            userName,
            image
        }
    },
}`;

export const pinDetailQuery = (
  pinId
) => `*[_type == "pin" && _id == "${pinId}"] {
  image {
      asset-> {
          url
      }
  },
    _id,
    destination,
    title,
    about,
    category,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
          _id,
          userName,
          image
      }
  },
    comments[]{
      _key,
      postedBy -> {
        _id,
        userName,
        image
      },
      comment
    }
}`;

export const pinDetailMorePinQuery = (
  pin
) => `*[_type == "pin" && category == "${pin.category}" && _id != "${pin._id}"] {
  image {
      asset-> {
          url
      }
  },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
          _id,
          userName,
          image
      }
  },
}`;
export const userSavedPinsQuery = (
  userId
) => `*[_type=="pin" && "${userId}" in save[].userId] | order(_createdAt desc) {
  image {
      asset-> {
          url
      }
  },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
          _id,
          userName,
          image
      }
  },
}`;

export const userCreatedPinsQuery = (
  userId
) => `*[_type=="pin" && userId == "${userId}"] | order(_createdAt desc) {
  image {
      asset-> {
          url
      }
  },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
          _id,
          userName,
          image
      }
  },
}`;
