import React from "react";

interface SeoSectionProps {
  slug: string;
  setSlug: (value: string) => void;
  metaTitle: string;
  setMetaTitle: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
}

const SeoSection: React.FC<SeoSectionProps> = ({
  slug,
  setSlug,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
}) => {
  return (
    <div className="md:w-[65%] mt-8 bg-[#0A2540] p-6 rounded-lg ">
      <h2 className="text-xl font-semibold mb-6 text-white">Seo & Meta</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Slug / URL */}
        <div>
          <label className="block text-base mb-2 text-white">Slug / URL</label>
          <input
            type="text"
            placeholder="Slug / URL"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-base mb-2 text-white">Title</label>
          <input
            type="text"
            placeholder="Meta Title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-base mb-2 text-white">Description</label>
        <textarea
          rows={4}
          placeholder="Descriptions"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default SeoSection;
