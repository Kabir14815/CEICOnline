from PIL import Image
import collections

def get_dominant_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGB")
        img = img.resize((150, 150))  # Resize for faster processing
        colors = img.getcolors(150 * 150)
        
        # Sort by count
        most_common = sorted(colors, key=lambda x: x[0], reverse=True)[0]
        rgb = most_common[1]
        hex_color = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
        return hex_color
    except Exception as e:
        return str(e)

image_path = r"C:/Users/kabir/.gemini/antigravity/brain/1ed60270-aeaf-4a1a-b94b-577c8f2bfab7/uploaded_image_1767873880534.png"
print(get_dominant_color(image_path))
