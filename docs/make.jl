using StoppingTutorials
using Documenter
using Printf
using Literate

assets_src = joinpath(@__DIR__,"..","assets")
assets_dst = joinpath(@__DIR__,"src","assets")

Sys.rm(assets_dst;recursive=true,force=true)

Sys.cp(assets_src,assets_dst)

repo_src = joinpath(@__DIR__,"..","src")
pages_dir = joinpath(@__DIR__,"src","pages")
notebooks_dir = joinpath(@__DIR__,"src","notebooks")

# Add index.md file as introduction to navigation menu
pages = ["Introduction"=> "index.md"]

binder_logo = "https://mybinder.org/badge_logo.svg"
nbviwer_logo = "https://img.shields.io/badge/show-nbviewer-579ACA.svg"

for (i,(title,filename)) in enumerate(StoppingTutorials.files)
  # Generate strings
  tutorial_prefix = string("t",@sprintf "%03d_" i)
  tutorial_title = string("# # Tutorial ", i, ": ", title)
  tutorial_file = string(tutorial_prefix,splitext(filename)[1])
  notebook_filename = string(tutorial_file, ".ipynb")
  binder_url = joinpath("@__BINDER_ROOT_URL__","notebooks", notebook_filename)
  nbviwer_url = joinpath("@__NBVIEWER_ROOT_URL__","notebooks", notebook_filename)
  binder_badge = string("# [![](",binder_logo,")](",binder_url,")")
  nbviwer_badge = string("# [![](",nbviwer_logo,")](",nbviwer_url,")")

  # Generate notebooks
  function preprocess_notebook(content)
    return string(tutorial_title, "\n\n", content)
  end
  Literate.notebook(joinpath(repo_src,filename), notebooks_dir; name=tutorial_file, preprocess=preprocess_notebook, documenter=false, execute=false)

  # Generate markdown
  function preprocess_docs(content)
    return string(tutorial_title, "\n", binder_badge, "\n", nbviwer_badge, "\n\n", content)
  end
  Literate.markdown(joinpath(repo_src,filename), pages_dir; name=tutorial_file, preprocess=preprocess_docs, codefence="```julia" => "```")

  # Generate navigation menu entries
  ordered_title = string(i, " ", title)
  path_to_markdown_file = joinpath("pages",string(tutorial_file,".md"))
  push!(pages, (ordered_title=>path_to_markdown_file))
end

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
    devbranch="main",
)
