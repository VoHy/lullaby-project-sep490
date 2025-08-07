// Test file để kiểm tra CustomizeTask API routes
// Chạy trong browser console hoặc test tool

const BASE_URL = 'http://localhost:3001';

// Test functions
const testCustomizeTaskAPI = async () => {
  try {
    // Test 1: GET /api/customizetask/getall
    const response1 = await fetch(`${BASE_URL}/api/customizetask/getall`);
    const data1 = await response1.json();

    // Test 2: GET /api/customizetask/getallbybooking/31 (sample booking ID)
    const response2 = await fetch(`${BASE_URL}/api/customizetask/getallbybooking/31`);
    const data2 = await response2.json();

    // Test 3: GET /api/customizetask/55 (sample task ID)
    const response3 = await fetch(`${BASE_URL}/api/customizetask/55`);
    const data3 = await response3.json();

    // Test 4: GET /api/customizetask/getallbycustomizepackage/41 (sample package ID)
    const response4 = await fetch(`${BASE_URL}/api/customizetask/getallbycustomizepackage/41`);
    const data4 = await response4.json();
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
