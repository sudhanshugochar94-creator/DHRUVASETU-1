-- ====================================================================
-- SIH26063: Integrated Polar Science Outreach & Knowledge Repository
-- National Centre for Polar and Ocean Research (NCPOR) • MoES
-- Migration: 005_seed_data.sql
-- Description: Seed data for demonstration and testing
-- ====================================================================

-- Deterministic UUID Constants for Seed Data
DO $$
DECLARE
    admin_id UUID := '00000000-0000-0000-0000-000000000001';
    editor_id UUID := '00000000-0000-0000-0000-000000000002';
    scientist_id UUID := '00000000-0000-0000-0000-000000000003';

    exp_isea_id UUID := '11111111-1111-1111-1111-111111111111';
    exp_arc_id UUID  := '22222222-2222-2222-2222-222222222222';
    exp_so_id UUID   := '33333333-3333-3333-3333-333333333333';
    exp_him_id UUID  := '44444444-4444-4444-4444-444444444444';

    res_report_id UUID := '55555555-5555-5555-5555-555555555551';
    res_arc_id UUID    := '55555555-5555-5555-5555-555555555552';
    res_data_id UUID   := '55555555-5555-5555-5555-555555555553';
    res_pub_id UUID    := '55555555-5555-5555-5555-555555555554';

    draft_1_id UUID := '66666666-6666-6666-6666-666666666661';
    draft_2_id UUID := '66666666-6666-6666-6666-666666666662';
BEGIN

    -- 1. SEED EXPEDITIONS
    INSERT INTO expeditions (id, name, slug, description, region, start_date, end_date, year, objectives, key_findings, hero_image_url, status)
    VALUES
    (
        exp_isea_id,
        '43rd Indian Scientific Expedition to Antarctica',
        'exp-isea-43',
        'Active interdisciplinary expedition executing 44 research objectives across glaciology, space weather, atmospheric profiling, and environmental baseline assessments.',
        'Antarctica',
        '2023-11-15',
        '2024-03-30',
        2024,
        '150m ice core recovery from coastal ice caps; GPS geodetic arrays for ice discharge; Atmospheric boundary layer radiometers at Maitri and Bharati.',
        'Retrieved 124m undisturbed coastal ice core; Detected ionospheric TEC anomalies correlating with coronal mass ejections; Drone thermal surveys of ablation zones.',
        '/images/antarctic-ice-shelf.jpg',
        'published'
    ),
    (
        exp_arc_id,
        '16th Indian Arctic Expedition (Himadri Winter Base)',
        'exp-arc-16',
        'Pioneering historic wintering campaign at Ny-Ålesund, Svalbard, monitoring polar night atmospheric aerosol dynamics and fjord hydrography.',
        'Arctic',
        '2023-12-01',
        '2024-04-15',
        2024,
        'Continuous polar night atmospheric profiling; High-latitude biogeochemistry of Kongsfjorden; Aurora borealis spectral flux monitoring.',
        'First complete multi-sensor winter baseline logged at Himadri; Documented warm Atlantic water intrusion in inner Kongsfjorden fjord basin.',
        '/images/arctic-fjord.jpg',
        'published'
    ),
    (
        exp_so_id,
        '12th Indian Southern Ocean Expedition',
        'exp-so-12',
        'Deep hydrographic and biogeochemical transect across the subtropical front to the Antarctic divergence zone in the Indian Ocean sector.',
        'Southern Ocean',
        '2022-01-10',
        '2022-03-12',
        2022,
        'Deep CTD casts to 5000m; Surface water pCO2 mapping; Phytoplankton community structure in the Polar Frontal Zone.',
        'Logged southward shift in Antarctic Circumpolar Current thermal boundary; Quantified localized primary productivity anomalies.',
        '/images/iceberg-sea.jpg',
        'published'
    ),
    (
        exp_him_id,
        '8th Indian Himalayan Cryosphere Expedition',
        'exp-him-08',
        'Glaciological mass balance, debris cover energy budget, and discharge monitoring across the Chandra Basin, Western Himalaya.',
        'Himalaya',
        '2023-06-01',
        '2023-09-30',
        2023,
        'Stake network ablation measurements at Sutri Dhaka glacier; Runoff hydrology gauging at Himansh station; Terrestrial LiDAR scans of terminus retreat.',
        'Calculated negative mass balance for 2022-23 hydrologic year; Terminus retreat of 14.2m measured at Batal glacier snout.',
        '/images/himalaya-peaks.jpg',
        'published'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. SEED CENTRAL RESOURCES
    INSERT INTO resources (id, title, slug, description, resource_type, region, research_theme, year, language, author, institution, expedition_id, file_url, thumbnail_url, file_type, file_size, license, status, view_count, download_count)
    VALUES
    (
        res_report_id,
        'Scientific Report of the 43rd Indian Scientific Expedition to Antarctica',
        'res-rep-2024-01',
        'Comprehensive operational and technical report detailing all scientific observations, glaciological traverses, and station maintenance at Maitri and Bharati during 2023-24.',
        'expedition_report',
        'Antarctica',
        'Glaciology',
        2024,
        'English',
        'Dr. Yogesh Ray, Dr. B. L. Redkar, et al.',
        'National Centre for Polar and Ocean Research',
        exp_isea_id,
        'https://example.com/reports/43-isea-report.pdf',
        '/images/antarctic-ice-shelf.jpg',
        'PDF',
        18874368,
        'CC BY 4.0',
        'published',
        1420,
        380
    ),
    (
        res_arc_id,
        'Indian Arctic Winter Campaign 2023-24: Baseline Operational Assessment',
        'res-rep-2023-02',
        'Operational field report from India’s historic maiden winter Arctic expedition based at Himadri station, Ny-Ålesund, Svalbard.',
        'expedition_report',
        'Arctic',
        'Atmospheric Science',
        2024,
        'English',
        'Dr. K. P. Krishnan, Dr. N. Anilkumar',
        'National Centre for Polar and Ocean Research',
        exp_arc_id,
        'https://example.com/reports/arctic-winter-report.pdf',
        '/images/arctic-fjord.jpg',
        'PDF',
        12582912,
        'CC BY 4.0',
        'published',
        890,
        210
    ),
    (
        res_data_id,
        'Prydz Bay & Amery Ice Shelf High-Resolution In-Situ Oceanographic Profile',
        'res-ds-2023-01',
        'High-density hydrographic CTD casts, dissolved oxygen, and acoustic Doppler current profiler telemetry collected along the Princess Elizabeth Land continental shelf.',
        'scientific_dataset',
        'Antarctica',
        'Oceanography',
        2023,
        'English',
        'NCPOR Ocean Dynamics Working Group',
        'NCPOR / Ministry of Earth Sciences',
        exp_isea_id,
        'https://example.com/datasets/prydz-bay-hydrography.nc',
        '/images/deep-ocean.jpg',
        'NetCDF',
        471859200,
        'Open Data Commons (ODC-By)',
        'published',
        2100,
        640
    ),
    (
        res_pub_id,
        'Decadal Cryospheric Mass Loss and Runoff Variability Across the Chandra Basin, Western Himalaya',
        'res-pub-2023-01',
        'Peer-reviewed analysis integrating in-situ ablation stakes, Himansh meteorological stations, and satellite altimetry to model cryospheric runoff trajectories.',
        'publication',
        'Himalaya',
        'Cryosphere Dynamics',
        2023,
        'English',
        'Dr. Thamban Meloth, Dr. Parmanand Sharma, Dr. Bhanu Pratap',
        'National Centre for Polar and Ocean Research',
        exp_him_id,
        'https://example.com/publications/chandra-basin-mass-loss.pdf',
        '/images/himalaya-peaks.jpg',
        'PDF',
        4404019,
        'CC BY 4.0',
        'published',
        3100,
        1150
    )
    ON CONFLICT (id) DO NOTHING;

    -- 3. SEED DATASETS
    INSERT INTO datasets (id, resource_id, name, description, region, research_theme, variables, time_range, format, file_size, download_url, metadata)
    VALUES
    (
        '77777777-7777-7777-7777-777777777771',
        res_data_id,
        'Antarctic Sea Ice Thickness & Concentration (Prydz Bay Sector)',
        'Continuous shipborne EM-bird ice thickness observations and satellite radiometer validation measurements recorded during the 43rd Antarctic Expedition.',
        'Antarctica',
        'Sea Ice Observations',
        'Ice Thickness (m), Snow Depth (cm), Surface Temperature (°C), Freeboard Height (cm)',
        'Dec 2023 – Feb 2024',
        'NetCDF / GeoTIFF / CSV',
        471859200,
        'https://example.com/datasets/seaice_thickness_43isea.zip',
        '{"spatial_coverage": "65°S to 70°S, 70°E to 80°E", "sampling_rate": "1 Hz acoustic", "sensor": "EM-bird IV & CTD SBE-911+"}'::jsonb
    ),
    (
        '77777777-7777-7777-7777-777777777772',
        res_arc_id,
        'Kongsfjorden High-Latitude Mooring Multi-Sensor Hydrography (IndARC Base)',
        'Sub-surface mooring data from 192m depth inside Kongsfjorden measuring temperature, salinity, turbidity, and dissolved oxygen through seasonal polar night cycles.',
        'Arctic',
        'Oceanographic Observations',
        'Potential Temperature (°C), Practical Salinity (PSU), Current Velocity (m/s), Dissolved Oxygen (mg/L)',
        'Aug 2022 – Sep 2023',
        'NetCDF / CSV',
        188743680,
        'https://example.com/datasets/indarc_mooring_2023.zip',
        '{"mooring_id": "IndARC-M5", "depth": "192m", "location": "78°59.04 N, 11°49.80 E"}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;

    -- 4. SEED PUBLICATIONS
    INSERT INTO publications (id, resource_id, title, authors, year, journal, abstract, keywords, doi, publication_url, pdf_url)
    VALUES
    (
        '88888888-8888-8888-8888-888888888881',
        res_pub_id,
        'Decadal Cryospheric Mass Loss and Runoff Variability Across the Chandra Basin, Western Himalaya',
        'Meloth, T., Sharma, P., Pratap, B., & Patel, L. K.',
        2023,
        'Journal of Glaciology & Climate Transitions',
        'Glaciers across the Chandra basin in Himachal Pradesh have exhibited acceleration in negative surface mass balance over the 2010–2023 observation period. By integrating high-altitude automated weather stations at Himansh with multi-temporal geodetic mass balances, we demonstrate an average thinning rate of 0.68 m w.e./yr.',
        'Himalayan Cryosphere, Glacier Mass Balance, Chandra Basin, Runoff Modeling, Himansh',
        '10.1017/jog.2023.84',
        'https://doi.org/10.1017/jog.2023.84',
        'https://example.com/publications/chandra-basin-mass-loss.pdf'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 5. SEED MEDIA ASSETS
    INSERT INTO media_assets (id, resource_id, title, media_type, file_url, thumbnail_url, caption, location, photographer, duration_seconds, expedition_id, year)
    VALUES
    (
        '99999999-9999-9999-9999-999999999991',
        res_report_id,
        'Bharati Station Under Polar Twilight (Larsemann Hills)',
        'photo',
        '/images/antarctic-ice-shelf.jpg',
        '/images/antarctic-ice-shelf.jpg',
        'Long exposure photograph capturing the futuristic Bharati research station structure under southern twilight, highlighting solar-wind array nodes.',
        'Larsemann Hills, East Antarctica',
        'Dr. Yogesh Ray (NCPOR)',
        NULL,
        exp_isea_id,
        2024
    ),
    (
        '99999999-9999-9999-9999-999999999992',
        res_arc_id,
        'Himadri Wintering Base: Aurora Borealis Over Ny-Ålesund',
        'photo',
        '/images/aurora-green.jpg',
        '/images/aurora-green.jpg',
        'Spectacular green aurora curtain dancing directly above India’s Himadri Arctic station during the deep polar night of December 2023.',
        'Ny-Ålesund, Svalbard',
        'Outreach Documentation Unit (NCPOR)',
        NULL,
        exp_arc_id,
        2024
    ),
    (
        '99999999-9999-9999-9999-999999999993',
        res_data_id,
        'CTD Rosette Deployment in Prydz Bay Ice Pack',
        'video',
        'https://assets.mixkit.co/videos/preview/mixkit-glacier-falling-into-water-4333-large.mp4',
        '/images/aurora-ice-field.jpg',
        'Field documentation of 24-bottle SBE rosette deployment off the chartered ice-class vessel into freezing Antarctic shelf waters.',
        'Prydz Bay, Antarctica',
        'Ocean Dynamics Field Crew',
        184,
        exp_isea_id,
        2023
    )
    ON CONFLICT (id) DO NOTHING;

    -- 6. SEED INSTITUTIONAL ACTIVITIES
    INSERT INTO institutional_activities (id, title, description, activity_type, date, location, image_url, status)
    VALUES
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'Flag-off of the 43rd Indian Scientific Expedition to Antarctica',
        'The Union Minister for Earth Sciences officially flagged off the 43rd Antarctic expedition contingent comprising 53 researchers and logistical engineers.',
        'Expedition Flag-off',
        '2023-11-20',
        'Mormugao Port, Goa',
        '/images/antarctic-ice-shelf.jpg',
        'published'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'Hosting of 46th Antarctic Treaty Consultative Meeting (ATCM) in India',
        'India hosted international delegates from 56 nations to deliberate on Antarctic biodiversity conservation, climate monitoring, and tourism management.',
        'International Diplomatic Summit',
        '2024-05-20',
        'Kochi, Kerala',
        '/images/sunrise-ridge.jpg',
        'published'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 7. SEED SCIENCE STORIES
    INSERT INTO science_stories (id, title, slug, summary, body, hero_image_url, research_theme, audience, reading_time, status)
    VALUES
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        'Wintering in Antarctica: How Indian Scientists Live in -40°C Isolation',
        'wintering-antarctica',
        'For 8 straight months each winter, small teams of Indian scientists at Maitri and Bharati are cut off from the rest of humanity by polar blizzards and unbroken night.',
        'When the last resupply ship departs Larsemann Hills in March, the Antarctic continent seals shut. Temperatures plummet below -40°C, and winds exceed 150 km/h in blinding blizzards known as herbie. At India’s Bharati station, an interdisciplinary crew of scientists, doctors, and engineers remains inside an elevated green habitat. Here is how they maintain continuous scientific observations and psychological resilience.',
        '/images/antarctic-ice-shelf.jpg',
        'Glaciology',
        'general_public',
        7,
        'published'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
        'The Third Pole: Why Himalayan Glaciers Dictate India’s Water Security',
        'glacier-melt-himalaya',
        'High in the Spiti valley at 4500m elevation, India’s Himansh observatory monitors the pulse of Western Himalayan glaciers.',
        'The Hindu Kush Himalaya holds the largest volume of snow and ice outside the polar regions, feeding ten major river systems that sustain over 1.3 billion people. At the Himansh research base in Himachal Pradesh, NCPOR researchers conduct arduous seasonal measurements on glaciers like Sutri Dhaka and Batal. Understanding how debris cover alters melt rates is essential for flood forecasting and irrigation management.',
        '/images/himalaya-peaks.jpg',
        'Cryosphere Dynamics',
        'school',
        5,
        'published'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 8. SEED LEARNING MODULES
    INSERT INTO learning_modules (id, title, description, level, topic, content, image_url, status)
    VALUES
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc1',
        'Introduction to Polar Geography: The Two Poles Compared',
        'Discover the fundamental physical differences between the Antarctic ice continent surrounded by ocean and the Arctic ocean surrounded by continents.',
        'beginner',
        'Polar Geography',
        'Lesson 1: What is Antarctica? Antarctica is a frozen continent covered by an ice sheet averaging 2 km in thickness. Lesson 2: What is the Arctic? The Arctic is mostly a frozen ocean surrounded by northern landmasses of Russia, Canada, Greenland, and Norway.',
        '/images/antarctic-ice-shelf.jpg',
        'published'
    ),
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc2',
        'Ice Core Paleoclimatology: Earth’s Ancient Atmosphere trapped in Bubbles',
        'Learn how scientists extract deep ice cores from the ice sheet and analyze tiny bubbles of ancient air to reconstruct greenhouse gas levels over 800,000 years.',
        'intermediate',
        'Paleoclimatology',
        'Lesson 1: How Snow Becomes Glacier Ice. Snow compacts into granular firn and eventually seals into solid ice containing air bubbles. Lesson 2: Stable Isotope Thermometry. Oxygen-18 and Deuterium ratios reveal historical temperature shifts.',
        '/images/aurora-ice-field.jpg',
        'published'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 9. SEED CONTENT DRAFTS, SOURCES & REVIEWS
    INSERT INTO content_drafts (id, title, content_type, audience, tone, summary, body, status)
    VALUES
    (
        draft_1_id,
        'Student Explainer: What Did Indian Scientists Find in Antarctica?',
        'student_explanation',
        'students',
        'educational',
        'An accessible, student-friendly exploration of glaciology and ice cores based on the 43rd Indian Antarctic Expedition.',
        'Did you know that ice sheets can remember the past? Indian scientists from the National Centre for Polar and Ocean Research drilled 124 meters down into the Antarctic ice shelf! In that ice, tiny bubbles of air trapped hundreds of years ago tell us what the air was like long before cars and factories were invented.',
        'under_review'
    ),
    (
        draft_2_id,
        'Social Thread: Discoveries from India’s Arctic Base Himadri',
        'social_media',
        'general_public',
        'public_friendly',
        'A 4-part social media thread explaining polar night atmospheric observations at Ny-Ålesund, Svalbard.',
        '1/4 ❄️ Discoveries from India’s Arctic Frontier! 🇮🇳 Our researchers at Himadri Station logged the first complete multi-sensor winter baseline at 79°N. 2/4 🔬 Observations show warmer Atlantic water pulses entering Kongsfjorden. 3/4 📊 These measurements help refine climate models for the monsoon. 4/4 🔗 Verified through official NCPOR open archives!',
        'approved'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO content_sources (id, content_draft_id, resource_id, expedition_id, source_title)
    VALUES
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        draft_1_id,
        res_report_id,
        exp_isea_id,
        'Scientific Report of the 43rd Indian Scientific Expedition to Antarctica'
    ),
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        draft_2_id,
        res_arc_id,
        exp_arc_id,
        'Indian Arctic Winter Campaign 2023-24: Baseline Operational Assessment'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO content_reviews (id, content_draft_id, status, comments)
    VALUES
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
        draft_2_id,
        'approved',
        'Scientifically verified against primary report data. Ready for MoES social channels.'
    )
    ON CONFLICT (id) DO NOTHING;

END $$;
