import { useEffect, useState } from "react";
import {
    FaHistory,
    FaTrashAlt,
    FaSearch,
} from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";

import HistoryList from "../../components/History/HistoryList";

import {
    getHistory,
    deleteHistory,
    deleteAllHistory,
} from "../../services/historyService";


const History = () => {

    // ==========================================================
    // STATE
    // ==========================================================

    const [history, setHistory] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalItems, setTotalItems] =
        useState(0);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedConversation, setSelectedConversation] =
        useState(null);


    const ITEMS_PER_PAGE = 10;


    // ==========================================================
    // FETCH HISTORY
    // ==========================================================

    const fetchHistory = async (page = 1) => {

        try {

            setLoading(true);

            const response =
                await getHistory(
                    page,
                    ITEMS_PER_PAGE
                );


            if (response.success) {

                setHistory(
                    response.data || []
                );

                setCurrentPage(
                    response.pagination?.currentPage || page
                );

                setTotalPages(
                    response.pagination?.totalPages || 1
                );

                setTotalItems(
                    response.pagination?.totalItems || 0
                );

            } else {

                toast.error(
                    response.message ||
                    "Failed to load history"
                );
            }

        } catch (error) {

            console.error(
                "Fetch history error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load conversation history"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        fetchHistory(1);

    }, []);


    // ==========================================================
    // DELETE ONE
    // ==========================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this conversation?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteHistory(id);

            toast.success(
                "Conversation deleted"
            );


            // If deleting the only item on
            // a page other than page 1,
            // go back one page.

            if (
                history.length === 1 &&
                currentPage > 1
            ) {

                await fetchHistory(
                    currentPage - 1
                );

            } else {

                await fetchHistory(
                    currentPage
                );

            }

        } catch (error) {

            console.error(
                "Delete history error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete conversation"
            );
        }
    };


    // ==========================================================
    // DELETE ALL
    // ==========================================================

    const handleDeleteAll = async () => {

        if (!totalItems) {

            toast.error(
                "There are no conversations to delete"
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete ALL conversation history? This action cannot be undone."
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteAllHistory();

            setHistory([]);

            setCurrentPage(1);

            setTotalPages(1);

            setTotalItems(0);

            toast.success(
                "All conversations deleted"
            );

        } catch (error) {

            console.error(
                "Delete all history error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete history"
            );
        }
    };


    // ==========================================================
    // VIEW
    // ==========================================================

    const handleView = (conversation) => {

        setSelectedConversation(
            conversation
        );
    };


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredHistory =
        history.filter((item) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            if (!search) {
                return true;
            }


            return (
                item.detectedWord
                    ?.toLowerCase()
                    .includes(search) ||

                item.generatedSentence
                    ?.toLowerCase()
                    .includes(search) ||

                item.englishText
                    ?.toLowerCase()
                    .includes(search) ||

                item.hindiText
                    ?.toLowerCase()
                    .includes(search) ||

                item.gujaratiText
                    ?.toLowerCase()
                    .includes(search) ||

                item.contextMode
                    ?.toLowerCase()
                    .includes(search)
            );
        });


    return (

        <div
            className="
                min-h-screen
                bg-slate-50
                dark:bg-slate-950
                transition-colors
                duration-300
            "
        >

            <DashboardNavbar />


            <main
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                "
            >

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-4
                        sm:mb-8
                        md:flex-row
                        md:items-end
                        md:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                mb-2
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-blue-100
                                dark:bg-blue-950/50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-blue-700
                                dark:text-blue-300
                            "
                        >

                            <FaHistory />

                            Conversation History

                        </div>


                        <h1
                            className="
                                text-2xl
                                font-extrabold
                                text-slate-900
                                dark:text-white
                                sm:text-3xl
                            "
                        >
                            Your Conversations
                        </h1>


                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                                sm:text-sm
                                sm:leading-6
                            "
                        >
                            View and manage your previously
                            generated ISL conversations.
                        </p>

                    </div>


                    {/* Delete All */}

                    {totalItems > 0 && (

                        <button
                            type="button"
                            onClick={handleDeleteAll}
                            className="
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-50
                                dark:bg-red-950/40
                                px-4
                                py-2.5
                                text-xs
                                font-semibold
                                text-red-600
                                dark:text-red-400
                                transition
                                hover:bg-red-100
                                dark:hover:bg-red-950/70
                                sm:w-auto
                            "
                        >
                            <FaTrashAlt />
                            Delete All
                        </button>

                    )}

                </div>


                {/* ==================================================
                    SEARCH + COUNT
                ================================================== */}

                <div
                    className="
                        mb-5
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            relative
                            w-full
                            sm:max-w-md
                        "
                    >

                        <FaSearch
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-xs
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search conversations..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                dark:border-slate-700
                                bg-white
                                dark:bg-slate-900
                                py-2.5
                                pl-9
                                pr-4
                                text-xs
                                text-slate-700
                                dark:text-slate-200
                                outline-none
                                placeholder:text-slate-400
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100
                                dark:focus:ring-blue-900
                            "
                        />

                    </div>


                    <p
                        className="
                            text-xs
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {totalItems} conversation
                        {totalItems !== 1
                            ? "s"
                            : ""}
                    </p>

                </div>


                {/* ==================================================
                    HISTORY LIST
                ================================================== */}

                <HistoryList
                    history={filteredHistory}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchHistory}
                    onDelete={handleDelete}
                    onView={handleView}
                />

            </main>


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {selectedConversation && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        px-4
                        py-6
                        backdrop-blur-sm
                    "
                    onClick={() =>
                        setSelectedConversation(null)
                    }
                >

                    <div
                        className="
                            max-h-[90vh]
                            w-full
                            max-w-2xl
                            overflow-y-auto
                            rounded-2xl
                            bg-white
                            dark:bg-slate-900
                            p-5
                            shadow-2xl
                            dark:shadow-black/60
                            sm:p-6
                        "
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Modal Header */}

                        <div
                            className="
                                mb-5
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    Conversation
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {
                                        selectedConversation
                                            .detectedWord
                                    }
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedConversation(
                                        null
                                    )
                                }
                                className="
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                    dark:text-slate-400
                                    hover:bg-slate-100
                                    dark:hover:bg-slate-800
                                "
                            >
                                Close
                            </button>

                        </div>


                        {/* Generated Sentence */}

                        {selectedConversation.generatedSentence && (

                            <div
                                className="
                                    rounded-xl
                                    bg-blue-50
                                    dark:bg-blue-950/40
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    Generated Sentence
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-lg
                                        font-bold
                                        leading-7
                                        text-slate-800
                                        dark:text-white
                                    "
                                >
                                    {
                                        selectedConversation
                                            .generatedSentence
                                    }
                                </p>

                            </div>

                        )}


                        {/* Translations */}

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-3
                            "
                        >

                            {[
                                {
                                    label: "English",
                                    value:
                                        selectedConversation
                                            .englishText,
                                },
                                {
                                    label: "Hindi",
                                    value:
                                        selectedConversation
                                            .hindiText,
                                },
                                {
                                    label: "Gujarati",
                                    value:
                                        selectedConversation
                                            .gujaratiText,
                                },
                            ].map(
                                (language) =>
                                    language.value && (

                                        <div
                                            key={
                                                language.label
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-100
                                                dark:border-slate-800
                                                bg-slate-50
                                                dark:bg-slate-950
                                                p-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wider
                                                    text-slate-400
                                                "
                                            >
                                                {
                                                    language.label
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    leading-6
                                                    text-slate-700
                                                    dark:text-slate-300
                                                "
                                            >
                                                {
                                                    language.value
                                                }
                                            </p>

                                        </div>

                                    )
                            )}

                        </div>


                        {/* Meta */}

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >

                            <div
                                className="
                                    rounded-xl
                                    bg-slate-50
                                    dark:bg-slate-950
                                    p-3
                                "
                            >

                                <p
                                    className="
                                        text-[9px]
                                        uppercase
                                        text-slate-400
                                    "
                                >
                                    Context
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        dark:text-slate-200
                                    "
                                >
                                    {
                                        selectedConversation
                                            .contextMode
                                    }
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-xl
                                    bg-slate-50
                                    dark:bg-slate-950
                                    p-3
                                "
                            >

                                <p
                                    className="
                                        text-[9px]
                                        uppercase
                                        text-slate-400
                                    "
                                >
                                    Confidence
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    {
                                        selectedConversation
                                            .confidenceScore !== null
                                            ? `${Number(
                                                selectedConversation
                                                    .confidenceScore
                                            ).toFixed(1)}%`
                                            : "N/A"
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default History;