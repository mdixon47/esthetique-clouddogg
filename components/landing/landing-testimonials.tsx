export function LandingTestimonials() {
    return (
      <div id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-pink-500 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Loved by fashion enthusiasts
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              See what our users are saying about their StyleAI experience.
            </p>
          </div>
  
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="/placeholder.svg?height=100&width=100&text=JD"
                      alt="Jane Doe"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Jane Doe</h4>
                    <p className="text-sm text-gray-500">Fashion Blogger</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "StyleAI has completely transformed how I plan my outfits. The AI suggestions are spot-on and I've
                  discovered new combinations from my existing wardrobe that I never would have thought of!"
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
  
              {/* Testimonial 2 */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="/placeholder.svg?height=100&width=100&text=JS"
                      alt="John Smith"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">John Smith</h4>
                    <p className="text-sm text-gray-500">Business Professional</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As someone who struggles with fashion choices, StyleAI has been a game-changer. The app helps me look
                  professional and put-together without spending hours deciding what to wear."
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
  
              {/* Testimonial 3 */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="/placeholder.svg?height=100&width=100&text=EJ"
                      alt="Emily Johnson"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Emily Johnson</h4>
                    <p className="text-sm text-gray-500">College Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The wardrobe organization feature is amazing! I can finally see all my clothes in one place, and the
                  outfit suggestions based on the weather have saved me so many times."
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${star === 5 ? "text-gray-300" : "text-yellow-400"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  