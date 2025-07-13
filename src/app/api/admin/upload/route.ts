import { NextResponse } from 'next/server';

if (!process.env.IMGBB_API_KEY) {
  throw new Error('IMGBB_API_KEY is not defined in environment variables');
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images');
    const productName = formData.get('productName') as string;

    const uploadPromises = images.map(async (image: any, index) => {
      // Create form data for ImgBB
      const imgbbFormData = new FormData();
      imgbbFormData.append('key', process.env.IMGBB_API_KEY as string);
      
      // Convert Blob to File if needed and append
      const imageFile = image instanceof File ? image : new File([image], 'image.jpg', { type: image.type || 'image/jpeg' });
      imgbbFormData.append('image', imageFile);
      
      // Add numbering if there are multiple images
      const imageName = images.length > 1 
        ? `${productName}_${index + 1}`
        : productName;
      imgbbFormData.append('name', imageName);

      try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: imgbbFormData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('ImgBB error response:', data);
          throw new Error(data.error?.message || 'Upload failed');
        }

        // Return both the display URL and delete URL
        return {
          url: data.data.display_url,
          deleteUrl: data.data.delete_url
        };
      } catch (error) {
        console.error('Individual upload error:', error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);
    
    // Separate URLs and delete URLs
    const urls = results.map(result => ({
      url: result.url,
      deleteUrl: result.deleteUrl
    }));

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { deleteUrl } = await request.json();
    
    if (!deleteUrl) {
      throw new Error('Delete URL is required');
    }

    // The delete URL is already a complete URL that we can visit to delete the image
    const response = await fetch(deleteUrl);
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 