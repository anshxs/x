"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductSpecificationsProps {
  product: any
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const [activeTab, setActiveTab] = useState("description")
  const [showFullDescription, setShowFullDescription] = useState(false)

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "warranty", label: "Warranty & Support" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-none">
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <div className="prose prose-sm max-w-none">
              <div className={`text-gray-700 leading-relaxed ${!showFullDescription ? "line-clamp-6" : ""}`}>
                {product.detailed_description || product.short_description || "No description available."}
              </div>
              {product.detailed_description && product.detailed_description.length > 300 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                >
                  {showFullDescription ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Video */}
            {product.video_url && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Product Video</h4>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe src={product.video_url} className="w-full h-full" allowFullScreen title="Product Video" />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Specifications</h3>
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="grid gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b border-gray-100 last:border-b-0">
                    <div className="w-1/3 text-sm font-medium text-gray-600 capitalize">{key.replace(/_/g, " ")}</div>
                    <div className="w-2/3 text-sm text-gray-900">{String(value)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}

            {/* Basic Info */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-md font-medium mb-3">Basic Information</h4>
              <div className="grid gap-1">
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-600">Brand</div>
                  <div className="w-2/3 text-sm text-gray-900">{product.brand || "N/A"}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-sm font-medium text-gray-600">Category</div>
                  <div className="w-2/3 text-sm text-gray-900">{product.category || "N/A"}</div>
                </div>
                {product.subcategory && (
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-gray-600">Subcategory</div>
                    <div className="w-2/3 text-sm text-gray-900">{product.subcategory}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "warranty" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Warranty & Support</h3>

            {/* Warranty Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Warranty Information</h4>
              <p className="text-sm text-gray-700">
                {product.warranty || "Please contact the seller for warranty information."}
              </p>
            </div>

            {/* Return Policy */}
            {product.replacement_return && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Return & Replacement Policy</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Return Available:</strong> {product.replacement_return.available ? "Yes" : "No"}
                  </p>
                  {product.replacement_return.available && product.replacement_return.days && (
                    <p>
                      <strong>Return Period:</strong> {product.replacement_return.days} days from delivery
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Support Info */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Customer Support</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• 24/7 customer support available</p>
                <p>• Email support: support@yourstore.com</p>
                <p>• Phone support: 1-800-123-4567</p>
                <p>• Live chat available on website</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
