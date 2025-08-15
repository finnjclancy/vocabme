const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}

async function testOpenAI(word) {
  console.log('Testing OpenAI API for word:', word);
  
  // Check if API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    return;
  }
  
  console.log('✅ API key found:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');
  
  const client = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });
  
  const prompt = `read this message and respond with an array of 3 definitions for the highlighted word/phrase in this message: "${word}"`;
  
  console.log('📤 Sending prompt:', prompt);
  
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'you are a helpful assistant that provides concise definitions. always respond with a valid json array of exactly 3 strings.' 
        },
        { 
          role: 'user', 
          content: prompt 
        },
      ],
      temperature: 0.3,
    });
    
    const text = response.choices[0]?.message?.content || '[]';
    console.log('📥 Raw response:', text);
    
    try {
      const cleanText = text.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
      console.log('🧹 Cleaned text:', cleanText);
      
      const arr = JSON.parse(cleanText);
      console.log('✅ Parsed array:', arr);
      
      if (Array.isArray(arr) && arr.length > 0) {
        console.log('🎉 Success! Got', arr.length, 'definitions:');
        arr.forEach((def, i) => console.log(`  ${i + 1}. ${def}`));
        return arr;
      } else {
        console.log('❌ No valid definitions found');
        return [];
      }
      
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Failed to parse:', text);
      return [];
    }
    
  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    return [];
  }
}

// Test with different words
async function runTests() {
  console.log('🚀 Starting OpenAI API tests...\n');
  
  const testWords = ['runner', 'excited', 'serendipity'];
  
  for (const word of testWords) {
    console.log(`\n--- Testing "${word}" ---`);
    const result = await testOpenAI(word);
    console.log(`Result for "${word}":`, result ? 'SUCCESS' : 'FAILED');
    console.log('---\n');
  }
}

// Load env and run tests
loadEnv();
runTests().catch(console.error);
