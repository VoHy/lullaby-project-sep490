// Test file để kiểm tra CustomizeTask API routes
// Chạy trong browser console hoặc test tool

const BASE_URL = 'http://localhost:3001';

// Test functions
const testCustomizeTaskAPI = async () => {
  console.log('🧪 Testing CustomizeTask API routes...');

  try {
    // Test 1: GET /api/customizetask/getall
    console.log('1. Testing GET /api/customizetask/getall');
    const response1 = await fetch(`${BASE_URL}/api/customizetask/getall`);
    const data1 = await response1.json();
    console.log('Response:', response1.status, data1);

    // Test 2: GET /api/customizetask/getallbybooking/31 (sample booking ID)
    console.log('2. Testing GET /api/customizetask/getallbybooking/31');
    const response2 = await fetch(`${BASE_URL}/api/customizetask/getallbybooking/31`);
    const data2 = await response2.json();
    console.log('Response:', response2.status, data2);

    // Test 3: GET /api/customizetask/55 (sample task ID)
    console.log('3. Testing GET /api/customizetask/55');
    const response3 = await fetch(`${BASE_URL}/api/customizetask/55`);
    const data3 = await response3.json();
    console.log('Response:', response3.status, data3);

    // Test 4: GET /api/customizetask/getallbycustomizepackage/41 (sample package ID)
    console.log('4. Testing GET /api/customizetask/getallbycustomizepackage/41');
    const response4 = await fetch(`${BASE_URL}/api/customizetask/getallbycustomizepackage/41`);
    const data4 = await response4.json();
    console.log('Response:', response4.status, data4);

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run tests
// testCustomizeTaskAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCustomizeTaskAPI };
}
