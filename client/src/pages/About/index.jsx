const About = () => {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Us</h1>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <img
                src="https://via.placeholder.com/400"
                alt="About Us"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
              <p className="text-lg text-gray-600 mb-4">
                We are a company dedicated to providing the best services for our customers.
                Our mission is to bring innovation, quality, and reliability to everything we do.
              </p>
              <p className="text-lg text-gray-600">
                Founded in 2021, we have grown to become a trusted partner in the industry. Our team
                of professionals is committed to excellence and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;