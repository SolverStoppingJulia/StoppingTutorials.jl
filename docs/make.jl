using StoppingTutorials
using Documenter

DocMeta.setdocmeta!(StoppingTutorials, :DocTestSetup, :(using StoppingTutorials); recursive=true)

makedocs(;
    modules=[StoppingTutorials],
    authors="Tangi Migot tangi.migot@gmail.com",
    repo="https://github.com/tmigot/StoppingTutorials.jl/blob/{commit}{path}#{line}",
    sitename="StoppingTutorials.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://tmigot.github.io/StoppingTutorials.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
    ],
)

deploydocs(;
    repo="github.com/tmigot/StoppingTutorials.jl",
    devbranch="master",
)
