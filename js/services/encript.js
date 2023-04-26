async function encryptValue(value, key) {
    try {
        const keys = await createKey(key)
        // Convert value to a Uint8Array
        const encoder = new TextEncoder();
        const data = encoder.encode(value);
    
        // Generate a random initialization vector (IV)
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
    
        // Encrypt the data with the key and IV using AES-CBC
        const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        keys,
        data
        );
    
        // Combine the IV and ciphertext into a single array
        const encryptedData = new Uint8Array(iv.length + ciphertext.byteLength);
        encryptedData.set(iv);
        encryptedData.set(new Uint8Array(ciphertext), iv.length);
    
        // Convert the encrypted data to a base64-encoded string
        return {status:true,value:btoa(String.fromCharCode(...encryptedData))};
    } catch (error) {
        return {status:false}
    }
  }
  
  async function decryptValue(encryptedValue, key) {
    try {
        const keys = await createKey(key);
        // Convert the base64-encoded string to a Uint8Array
        const encryptedData = new Uint8Array(
        atob(encryptedValue)
            .split('')
            .map(char => char.charCodeAt(0))
        );
    
        // Split the IV and ciphertext from the encrypted data
        const iv = encryptedData.slice(0, 16);
        const ciphertext = encryptedData.slice(16);
    
        // Decrypt the ciphertext with the key and IV using AES-CBC
        const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv }, keys, ciphertext);
    
        // Convert the decrypted data to a string
        const decoder = new TextDecoder();
        return {status:true, value:decoder.decode(decryptedData)};
    } catch (error) {
        return {status:false}
    }
  }
  
  async function createKey(value) {
    // Convert value to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
  
    // Use SHA-256 hash of the data as the seed for the key generation
    const hash = await window.crypto.subtle.digest('SHA-256', data);
  
    // Generate the key from the hash
    const key = await window.crypto.subtle.importKey(
      'raw',
      hash.slice(0, 32),
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    return key;
  }
  
//   (async () => {
//     const value = 'secret message';
//     const encryptedValue = await encryptValue(value, 'my secret key');
//     console.log('Encrypted value:', encryptedValue);
  

//     const decryptedValue = await decryptValue(encryptedValue.value, 'my secret key');
//     console.log('Decrypted value:', decryptedValue);
   
//   })();
  
