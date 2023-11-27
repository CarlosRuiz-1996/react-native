export  function getImageUrl(userId, photos) {
    const photo = photos.find((photo) => photo.startsWith(`${userId}-`));
    if (photo) {
      return photo;
    }
    
  }